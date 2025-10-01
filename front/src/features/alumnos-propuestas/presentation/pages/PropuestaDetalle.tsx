// src/features/alumnos-propuestas/presentation/pages/PropuestaDetalle.tsx
import React, { useMemo, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { PropuestaCompleta } from "../../data/models/Propuesta";
import Status from "../../../shared/components/Status";
import Button from "../../../shared/components/Button";
import MainContainer from "../../../shared/layout/MainContainer";
import { useAuth } from "../../../../core/utils/AuthContext";
import { CommentsViewModel } from "../../../propuestas-comentarios/presentation/viewModels/CommentsViewModel";
import VotingHelpModal from "../../../propuestas-comentarios/presentation/components/VotingHelpModal";
import VotingCommentModal from "../../../propuestas-comentarios/presentation/components/VotingCommentModal";
import SectionCommentsModal from "../../../propuestas-comentarios/presentation/components/SectionCommentsModal";
import { VoteCounter } from "../components/VoteCounter";
import { useVoteStats } from "../../data/hooks/useVoteStats";
import { CommentsSection } from "../components/CommentsSection";
import { useComments } from "../../data/hooks/useComments";
import { PropuestaDetailViewModelInterface } from "../interfaces/PropuestaDetailViewModelInterface";
import { 
  FiCalendar, FiUser, FiBriefcase, FiFileText, FiTarget, FiTool, 
  FiActivity, FiClock, FiMail, FiGlobe, FiPhone, FiMapPin, FiBook,
  FiCheck, FiX, FiHelpCircle, FiMessageSquare, FiArrowLeft, FiInfo
} from "react-icons/fi";

// Interface movida a archivo separado

interface PropuestaDetalleProps {
  propuesta: PropuestaCompleta;
  viewModel: PropuestaDetailViewModelInterface;
}

const PropuestaDetalle: React.FC<PropuestaDetalleProps> = observer(({ 
  propuesta, 
  viewModel 
}) => {
  const navigate = useNavigate();
  const authViewModel = useAuth();
  const commentsViewModel = useMemo(() => new CommentsViewModel(), []);
  
  // Hook para obtener estadísticas de votos
  const { voteStats, isLoading: voteStatsLoading, error: voteStatsError, refetch: refetchVoteStats } = useVoteStats(propuesta.getId());
  
  // Hook para obtener comentarios
  const { comments, isLoading: commentsLoading, error: commentsError, refetch: refetchComments } = useComments(propuesta.getId());
  
  // Estado para el modal de ayuda
  const [showHelpModal, setShowHelpModal] = useState(false);
  
  // Estado para comentarios por sección
  const [showCommentForm, setShowCommentForm] = useState<{
    sectionName: string;
    subsectionName: string;
  } | null>(null);
  
  // Estado para modal de votación con comentario
  const [showVotingModal, setShowVotingModal] = useState<{
    voteType: 'APROBADO' | 'RECHAZADO';
  } | null>(null);
  
  // Verificar si el usuario es tutor académico (PTC o PA)
  const isTutorAcademico = authViewModel.userRoles.some((role: any) => 
    ['PTC', 'PA', 'Director', 'SUPER-ADMIN'].includes(role.name)
  );

  const statusInfo = viewModel.getPropuestaStatus(propuesta);
  
  // Obtener el estado detallado directamente de la propuesta
  const proposalStatus = propuesta.getStatusInfo();

  // Cargar comentarios cuando se monta el componente
  useEffect(() => {
    const proposalId = propuesta.getId();
    if (isTutorAcademico && proposalId) {
      console.log('🔄 Cargando comentarios para propuesta:', proposalId);
      commentsViewModel.loadComments(proposalId);
    }
  }, [isTutorAcademico, propuesta, commentsViewModel]);

  // Manejar apertura del formulario de comentarios
  const handleOpenCommentForm = (sectionName: string, subsectionName: string) => {
    setShowCommentForm({ sectionName, subsectionName });
  };

  // Manejar cierre del formulario de comentarios
  const handleCloseCommentForm = () => {
    setShowCommentForm(null);
  };

  // Manejar éxito del comentario
  const handleCommentSuccess = async () => {
    setShowCommentForm(null);
    // Recargar comentarios
    await commentsViewModel.loadComments(propuesta.getId());
    // Recargar estadísticas de votos y comentarios
    refetchVoteStats();
    refetchComments();
  };

  // Manejar apertura del modal de votación
  const handleVoteClick = (voteType: 'APROBADO' | 'RECHAZADO') => {
    if (commentsViewModel.loading) {
      console.log('⏳ Ya hay una votación en proceso...');
      return;
    }
    setShowVotingModal({ voteType });
  };

  // Manejar votación de la propuesta completa con comentario
  const handleVote = async (comment: string) => {
    if (!showVotingModal) return;
    
    const voteType = showVotingModal.voteType;
    
    try {
      console.log(`🗳️ Votando ${voteType} para la propuesta ${propuesta.getId()} con comentario: ${comment}`);
      
      let success = false;
      
      switch (voteType) {
        case 'APROBADO':
          success = await commentsViewModel.approveProposal(propuesta.getId(), comment);
          break;
        case 'RECHAZADO':
          success = await commentsViewModel.rejectProposal(propuesta.getId(), comment);
          break;
      }
      
      if (success) {
        // Cerrar el modal de votación
        setShowVotingModal(null);
        
        // Recargar comentarios después de votar exitosamente
        console.log('🔄 Recargando comentarios después de votar...');
        await commentsViewModel.loadComments(propuesta.getId());
        
        // Recargar estadísticas de votos y comentarios
        refetchVoteStats();
        refetchComments();
        
        // ✅ NUEVO: Actualizar el estado del voto final
        console.log('🔄 Actualizando estado del voto final...');
        const updatedVoteResult = await commentsViewModel.checkTutorFinalVote(propuesta.getId());
        setTutorFinalVote(updatedVoteResult);
        
        alert(`✅ Has votado ${voteType} para esta propuesta exitosamente.`);
      } else {
        alert(`❌ Error al procesar la votación. ${commentsViewModel.error || 'Inténtalo de nuevo.'}`);
      }
    } catch (error) {
      console.error('Error al votar:', error);
      alert('❌ Error al procesar la votación. Inténtalo de nuevo.');
    }
  };

  // Manejar cierre del modal de votación
  const handleCloseVotingModal = () => {
    setShowVotingModal(null);
  };

  // ✅ NUEVO: Estado para verificar voto final del tutor
  const [tutorFinalVote, setTutorFinalVote] = useState<{
    hasVoted: boolean;
    voteStatus?: 'ACEPTADO' | 'RECHAZADO';
    commentText?: string;
    createdAt?: Date;
    tutorName?: string;
    tutorEmail?: string;
  } | null>(null);

  // Verificar si el tutor actual ya votó
  const currentTutorUuid = authViewModel.currentUser?.getUuid();
  const currentTutorIdRaw = authViewModel.currentUser?.getId();
  const currentTutorId = currentTutorIdRaw ? String(currentTutorIdRaw) : '';
  
  // Obtener información del token JWT almacenado
  const getTokenInfo = () => {
    try {
      const token = localStorage.getItem('auth-token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return {
          uuid: payload.uuid,
          roles: payload.roles || []
        };
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    }
    return null;
  };
  
  const tokenInfo = getTokenInfo();
  
  // Identificar roles del usuario
  const isDirector = authViewModel.userRoles.some((role: any) => role.name === 'Director');
  const isPTC = authViewModel.userRoles.some((role: any) => role.name === 'PTC');
  
  // Usar el ID real del usuario si está disponible (convertir a número)
  const effectiveTutorId = currentTutorId && currentTutorId !== '' ? Number(currentTutorId) : null;
  
  // ✅ NUEVO: Verificar voto final del tutor (SOLO para tutores académicos)
  useEffect(() => {
    const checkTutorFinalVote = async () => {
      // ✅ CORRECCIÓN: Solo ejecutar para tutores académicos, NO para alumnos
      if (!isTutorAcademico) {
        console.log('ℹ️ Usuario no es tutor académico, omitiendo verificación de voto final');
        setTutorFinalVote(null);
        return;
      }
      
      console.log('🔄 useEffect checkTutorFinalVote ejecutándose:', {
        isTutorAcademico,
        proposalId: propuesta.getId(),
        effectiveTutorId,
        currentTutorId,
        authUser: authViewModel.currentUser ? {
          id: authViewModel.currentUser.getId(),
          uuid: authViewModel.currentUser.getUuid()
        } : null
      });
      
      if (propuesta.getId() && effectiveTutorId) {
        console.log('🔍 Verificando voto final del tutor:', { 
          proposalId: propuesta.getId(), 
          tutorId: effectiveTutorId 
        });
        
        try {
          const result = await commentsViewModel.checkTutorFinalVote(propuesta.getId());
          console.log('✅ Resultado verificación voto final:', result);
          setTutorFinalVote(result);
        } catch (error) {
          console.error('❌ Error verificando voto final:', error);
          setTutorFinalVote(null);
        }
      } else {
        console.log('⚠️ No se puede verificar voto final:', {
          proposalId: propuesta.getId(),
          effectiveTutorId,
          currentTutorId
        });
        setTutorFinalVote(null);
      }
    };

    checkTutorFinalVote();
  }, [isTutorAcademico, propuesta, effectiveTutorId, commentsViewModel, authViewModel.currentUser]);

  // Buscar comentarios del tutor actual (para compatibilidad con código existente)
  const tutorComments = commentsViewModel.comments.filter((comment: any) => {
    // Usar el ID efectivo calculado
    return Number(comment.getTutorId()) === Number(effectiveTutorId);
  });
  
  // ✅ NUEVO: Usar la verificación de voto final en lugar de cualquier comentario
  const hasVoted = tutorFinalVote?.hasVoted || false;
  const tutorVote = tutorFinalVote;

  return (
    <MainContainer>
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate(-1)}
                variant="ghost"
                size="sm"
                icon={<FiArrowLeft className="w-4 h-4" />}
                label="Volver"
              />
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold text-gray-900 truncate">
                  {propuesta.getProyecto()?.getNombre() || 'Proyecto sin nombre'}
                </h1>
                <p className="text-md font-light text-gray-600">
                  {isTutorAcademico ? 'Revisar y votar sobre la propuesta' : 'Detalles completos de la propuesta'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Status 
                active={propuesta.isActive()}
                label={proposalStatus.label}
                className={`${proposalStatus.color} ${proposalStatus.bgColor}`}
              />
              
              {/* Botones de votación - Solo para tutores académicos */}
              {isTutorAcademico && (
                <div className="flex flex-col items-end gap-2">
                  {/* Verificar si la propuesta ya tiene veredicto final */}
                  {proposalStatus.status === 'aprobado' || proposalStatus.status === 'rechazado' ? (
                    // Mostrar mensaje de propuesta con veredicto
                    <div className="flex items-center gap-2 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <FiInfo className="w-5 h-5 text-blue-600" />
                      <div className="text-sm">
                        <div className="font-semibold text-blue-800">
                          Propuesta con veredicto final
                        </div>
                        <div className="text-blue-700">
                          Esta propuesta ya tiene un veredicto ({proposalStatus.label}) y no recibirá más votos.
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Información sobre votación */}
                      <div className="flex items-center gap-2 text-xs text-gray-600 text-right">
                        <span>
                          <strong>Votación completa:</strong> Aprobar o rechazar toda la propuesta
                        </span>
                        <Button
                          onClick={() => setShowHelpModal(true)}
                          variant="ghost"
                          size="sm"
                          icon={<FiHelpCircle className="w-4 h-4" />}
                          title="Ver guía de votación"
                          aria-label="Ver guía de votación"
                        />
                      </div>
                      
                      {!hasVoted ? (
                    // Mostrar botones de votación si no ha votado
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handleVoteClick('APROBADO')}
                        disabled={commentsViewModel.loading}
                        loading={commentsViewModel.loading}
                        variant="success"
                        size="sm"
                        icon={<FiCheck className="w-4 h-4" />}
                        label={commentsViewModel.loading ? 'Procesando...' : 'Aprobar Propuesta'}
                        title={commentsViewModel.loading ? "Procesando..." : "Aprobar esta propuesta completa"}
                      />
                      
                      <Button
                        onClick={() => handleVoteClick('RECHAZADO')}
                        disabled={commentsViewModel.loading}
                        loading={commentsViewModel.loading}
                        variant="danger"
                        size="sm"
                        icon={<FiX className="w-4 h-4" />}
                        label={commentsViewModel.loading ? 'Procesando...' : 'Rechazar Propuesta'}
                        title={commentsViewModel.loading ? "Procesando..." : "Rechazar esta propuesta completa"}
                      />
                    </div>
                  ) : (
                    // ✅ NUEVO: Mostrar estado de la evaluación si ya votó con voto final
                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">
                        Tu evaluación:
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        tutorVote?.voteStatus === 'ACEPTADO' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {tutorVote?.voteStatus === 'ACEPTADO' ? 'APROBADO' : 'RECHAZADO'}
                      </span>
                      {tutorVote?.createdAt && (
                        <span className="text-xs text-gray-500">
                          el {new Date(tutorVote.createdAt).toLocaleDateString('es-ES')}
                        </span>
                      )}
                    </div>
                  )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Contador de Votos - Solo para alumnos */}
      {!isTutorAcademico && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {voteStatsError ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="text-red-800">
                <strong>Error:</strong> {voteStatsError}
              </div>
            </div>
          ) : (
            <VoteCounter voteStats={voteStats} isLoading={voteStatsLoading} />
          )}
        </div>
      )}
      
      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          
          {/* Columna principal - Información del proyecto */}
          <div className="xl:col-span-3 space-y-6">
            
            {/* Información General del Proyecto */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <FiBriefcase className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Información General</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tipo de Pasantía */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <FiCalendar className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-blue-900">Tipo de Pasantía</h3>
                  </div>
                  <p className="text-blue-800 font-bold text-lg">
                    {propuesta.getTipoPasantia()}
                  </p>
                </div>


                {/* Duración */}
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <FiCalendar className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-purple-900">Duración</h3>
                  </div>
                  <p className="text-purple-800 font-medium text-sm">
                    {viewModel.formatDate(propuesta.getProyecto().getFechaInicio())} - {viewModel.formatDate(propuesta.getProyecto().getFechaFin())}
                  </p>
                </div>
              </div>
            </div>

            {/* Descripción del Proyecto */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <FiBook className="w-6 h-6 text-red-600" />
                <h2 className="text-2xl font-bold text-gray-900">Descripción del Proyecto</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h3 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                    <FiBook className="w-5 h-5" />
                    Contexto del Problema
                  </h3>
                  <p className="text-red-800 leading-relaxed whitespace-pre-wrap break-words">
                    {propuesta.getProyecto().getContextoProblema()}
                  </p>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <h3 className="font-semibold text-orange-900 mb-3 flex items-center gap-2">
                    <FiTarget className="w-5 h-5" />
                    Descripción del Problema
                  </h3>
                  <p className="text-orange-800 leading-relaxed whitespace-pre-wrap break-words">
                    {propuesta.getProyecto().getDescripcionProblema()}
                  </p>
                </div>
              </div>
              
              {/* Botón de comentario para tutores académicos */}
              {isTutorAcademico && !hasVoted && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <Button
                    onClick={() => handleOpenCommentForm('Datos del Proyecto', 'Contexto y Problemática')}
                    variant="ghost"
                    size="sm"
                    icon={<FiMessageSquare className="w-4 h-4" />}
                    label="Comentar esta sección"
                    className="bg-red-100 text-red-700 hover:bg-red-200"
                  />
                </div>
              )}
            </div>

            {/* Objetivos del Proyecto */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <FiTarget className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900">Objetivos del Proyecto</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                    <FiTarget className="w-5 h-5" />
                    Objetivo General
                  </h3>
                  <p className="text-green-800 leading-relaxed whitespace-pre-wrap break-words">
                    {propuesta.getProyecto().getObjetivoGeneral()}
                  </p>
                </div>

                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                  <h3 className="font-semibold text-emerald-900 mb-3 flex items-center gap-2">
                    <FiTarget className="w-5 h-5" />
                    Objetivos Específicos
                  </h3>
                  <p className="text-emerald-800 leading-relaxed whitespace-pre-wrap break-words">
                    {propuesta.getProyecto().getObjetivosEspecificos()}
                  </p>
                </div>
              </div>
              
              {/* Botón de comentario para tutores académicos */}
              {isTutorAcademico && !hasVoted && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <Button
                    onClick={() => handleOpenCommentForm('Datos del Proyecto', 'Objetivos del Proyecto')}
                    variant="ghost"
                    size="sm"
                    icon={<FiMessageSquare className="w-4 h-4" />}
                    label="Comentar esta sección"
                    className="bg-green-100 text-green-700 hover:bg-green-200"
                  />
                </div>
              )}
            </div>

            {/* Actividades y Entregables */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <FiActivity className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900">Actividades y Entregables</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h3 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                    <FiActivity className="w-5 h-5" />
                    Actividades Principales
                  </h3>
                  <p className="text-purple-800 leading-relaxed whitespace-pre-wrap break-words">
                    {propuesta.getProyecto().getActividadesPrincipales()}
                  </p>
                </div>

                <div className="bg-violet-50 p-4 rounded-lg border border-violet-200">
                  <h3 className="font-semibold text-violet-900 mb-3 flex items-center gap-2">
                    <FiFileText className="w-5 h-5" />
                    Entregables Planeados
                  </h3>
                  <p className="text-violet-800 leading-relaxed whitespace-pre-wrap break-words">
                    {propuesta.getProyecto().getEntregablesPlaneados()}
                  </p>
                </div>
              </div>
              
              {/* Botón de comentario para tutores académicos */}
              {isTutorAcademico && !hasVoted && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <Button
                    onClick={() => handleOpenCommentForm('Datos del Proyecto', 'Actividades y Entregables')}
                    variant="ghost"
                    size="sm"
                    icon={<FiMessageSquare className="w-4 h-4" />}
                    label="Comentar esta sección"
                    className="bg-purple-100 text-purple-700 hover:bg-purple-200"
                  />
                </div>
              )}
            </div>

            {/* Tecnologías */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <FiTool className="w-6 h-6 text-cyan-600" />
                <h2 className="text-2xl font-bold text-gray-900">Tecnologías</h2>
              </div>
              
              <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-200">
                <p className="text-cyan-800 leading-relaxed whitespace-pre-wrap break-words">
                  {propuesta.getProyecto().getTecnologias()}
                </p>
              </div>
              
              {/* Botón de comentario para tutores académicos */}
              {isTutorAcademico && !hasVoted && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <Button
                    onClick={() => handleOpenCommentForm('Datos del Proyecto', 'Tecnologías')}
                    variant="ghost"
                    size="sm"
                    icon={<FiMessageSquare className="w-4 h-4" />}
                    label="Comentar esta sección"
                    className="bg-cyan-100 text-cyan-700 hover:bg-cyan-200"
                  />
                </div>
              )}
            </div>

            {/* Información de la Empresa y Contactos */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <FiBriefcase className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900">Información de la Empresa</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Información de la Empresa */}
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h3 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                    <FiBriefcase className="w-5 h-5" />
                    Datos de la Empresa
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-semibold text-purple-700 mb-1">Nombre Comercial</p>
                      <p className="text-purple-900 font-bold break-words">
                        {propuesta.getEmpresa().getNombreCorto() || 'No especificado'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-purple-700 mb-1">Razón Social</p>
                      <p className="text-purple-900 font-medium break-words">
                        {propuesta.getEmpresa().getRazonSocial()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-purple-700 mb-1">RFC</p>
                      <p className="text-purple-900 font-mono">
                        {propuesta.getEmpresa().getRFC()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-purple-700 mb-1">Sector</p>
                      <p className="text-purple-900 font-medium break-words">
                        {propuesta.getEmpresa().getSector()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Dirección */}
                <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                  <h3 className="font-semibold text-pink-900 mb-3 flex items-center gap-2">
                    <FiMapPin className="w-5 h-5" />
                    Dirección
                  </h3>
                  <p className="text-pink-900 leading-relaxed break-words">
                    {propuesta.getEmpresa().getDireccion().getDireccionCompleta()}
                  </p>
                </div>

                {/* Contacto */}
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <h3 className="font-semibold text-orange-900 mb-3 flex items-center gap-2">
                    <FiPhone className="w-5 h-5" />
                    Persona de Contacto
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-semibold text-orange-700 mb-1">Nombre</p>
                      <p className="text-orange-900 font-bold break-words">
                        {propuesta.getContacto().getNombre()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-orange-700 mb-1">Puesto</p>
                      <p className="text-orange-900 font-medium break-words">
                        {propuesta.getContacto().getPuesto()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-orange-700 mb-1">Email</p>
                      <a 
                        href={`mailto:${propuesta.getContacto().getEmail()}`}
                        className="text-orange-900 hover:text-orange-700 font-medium break-all flex items-center gap-1"
                      >
                        <FiMail className="w-4 h-4 flex-shrink-0" />
                        {propuesta.getContacto().getEmail()}
                      </a>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-orange-700 mb-1">Teléfono</p>
                      <a 
                        href={`tel:${propuesta.getContacto().getTelefono()}`}
                        className="text-orange-900 hover:text-orange-700 font-medium"
                      >
                        {propuesta.getContacto().getTelefono()}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Botón de comentario para tutores académicos */}
              {isTutorAcademico && !hasVoted && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <Button
                    onClick={() => handleOpenCommentForm('Información de la Empresa', 'Datos de la Empresa')}
                    variant="ghost"
                    size="sm"
                    icon={<FiMessageSquare className="w-4 h-4" />}
                    label="Comentar esta sección"
                    className="bg-purple-100 text-purple-700 hover:bg-purple-200"
                  />
                </div>
              )}
            </div>

            {/* Información Académica */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <FiUser className="w-6 h-6 text-indigo-600" />
                <h2 className="text-2xl font-bold text-gray-900">Información Académica</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Tutor Académico */}
                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                  <h3 className="font-semibold text-indigo-900 mb-3 flex items-center gap-2">
                    <FiUser className="w-5 h-5" />
                    Tutor Académico
                  </h3>
                  <div className="space-y-2">
                    <p className="font-bold text-indigo-900 text-lg mb-2 break-words">
                      {propuesta.getTutorAcademico().getNombre()}
                    </p>
                    <div className="flex items-center gap-2">
                      <FiMail className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                      <a 
                        href={`mailto:${propuesta.getTutorAcademico().getEmail()}`}
                        className="text-indigo-700 hover:text-indigo-800 font-medium break-all"
                      >
                        {propuesta.getTutorAcademico().getEmail()}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Supervisor del Proyecto */}
                <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                  <h3 className="font-semibold text-teal-900 mb-3 flex items-center gap-2">
                    <FiUser className="w-5 h-5" />
                    Supervisor del Proyecto
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-semibold text-teal-700 mb-1">Nombre</p>
                      <p className="text-teal-900 font-bold break-words">
                        {propuesta.getSupervisor().getNombre()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-teal-700 mb-1">Área</p>
                      <p className="text-teal-900 font-medium break-words">
                        {propuesta.getSupervisor().getArea()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-teal-700 mb-1">Email</p>
                      <a 
                        href={`mailto:${propuesta.getSupervisor().getEmail()}`}
                        className="text-teal-900 hover:text-teal-700 font-medium break-all flex items-center gap-1"
                      >
                        <FiMail className="w-4 h-4 flex-shrink-0" />
                        {propuesta.getSupervisor().getEmail()}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Botón de comentario para tutores académicos */}
              {isTutorAcademico && !hasVoted && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <Button
                    onClick={() => handleOpenCommentForm('Tutor Académico', 'Información del Tutor')}
                    variant="ghost"
                    size="sm"
                    icon={<FiMessageSquare className="w-4 h-4" />}
                    label="Comentar esta sección"
                    className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                  />
                </div>
              )}
            </div>

            {/* Información de Registro */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <FiClock className="w-6 h-6 text-gray-600" />
                <h2 className="text-2xl font-bold text-gray-900">Información de Registro</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="text-sm text-green-700 font-semibold mb-1">Fecha de registro</p>
                  <p className="text-sm text-green-900 font-medium">
                    {viewModel.formatDateTime(propuesta.getCreatedAt())}
                  </p>
                </div>
                {propuesta.getUpdatedAt() && propuesta.getUpdatedAt()?.getTime() !== propuesta.getCreatedAt()?.getTime() && (
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <p className="text-sm text-yellow-700 font-semibold mb-1">Última actualización</p>
                    <p className="text-sm text-yellow-900 font-medium">
                      {viewModel.formatDateTime(propuesta.getUpdatedAt()!)}
                    </p>
                  </div>
                )}
              </div>
              
              {/* ID único */}
              <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600">
                  <span className="font-semibold">ID de Propuesta:</span> 
                  <span className="font-mono ml-1">{propuesta.getId()}</span>
                </p>
              </div>
            </div>

            {/* Información para tutores académicos */}
            {isTutorAcademico && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
                  <FiHelpCircle className="w-5 h-5" />
                  Información para Tutores Académicos
                </h3>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li>• Use los botones de votación en la parte superior para evaluar esta propuesta</li>
                  <li>• <strong>Aprobar:</strong> La propuesta cumple con todos los requisitos</li>
                  <li>• <strong>Rechazar:</strong> La propuesta no cumple con los requisitos mínimos</li>
                  <li>• <strong>Actualizar:</strong> La propuesta necesita modificaciones antes de ser evaluada</li>
                  <li>• Una vez votada con <strong>Aprobado</strong> o <strong>Rechazado</strong>, no podrás volver a votar</li>
                  <li>• Si votaste <strong>Actualizar</strong>, podrás modificar tu evaluación</li>
                  <li>• Una vez votada, la propuesta cambiará su estado automáticamente</li>
                </ul>
              </div>
            )}
          </div>

          {/* Columna derecha - EXCLUSIVAMENTE Comentarios y Evaluaciones */}
          <div className="xl:col-span-2 space-y-6">
            <CommentsSection 
              comments={comments} 
              isLoading={commentsLoading} 
            />
          </div>
        </div>
      </div>
      
      {/* Modal de comentarios por sección */}
      <SectionCommentsModal
        isOpen={showCommentForm !== null}
        onClose={handleCloseCommentForm}
        viewModel={commentsViewModel}
        proposalId={propuesta.getId()}
        sectionName={showCommentForm?.sectionName || ''}
        subsectionName={showCommentForm?.subsectionName || ''}
        onCommentSuccess={handleCommentSuccess}
      />

      {/* Modal de votación con comentario */}
      <VotingCommentModal
        isOpen={showVotingModal !== null}
        voteType={showVotingModal?.voteType || 'APROBADO'}
        onClose={handleCloseVotingModal}
        onVote={handleVote}
        loading={commentsViewModel.loading}
      />

      {/* Modal de ayuda */}
      <VotingHelpModal 
        isOpen={showHelpModal} 
        onClose={() => setShowHelpModal(false)} 
      />
      </div>
    </MainContainer>
  );
});

export default PropuestaDetalle;
