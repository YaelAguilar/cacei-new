// src/features/alumnos-propuestas/presentation/pages/PropuestaDetalle.tsx
import React, { useMemo, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useParams, useNavigate } from "react-router-dom";
import { PropuestaCompleta } from "../../data/models/Propuesta";
import Status from "../../../shared/components/Status";
import MainContainer from "../../../shared/layout/MainContainer";
import { useAuth } from "../../../../core/utils/AuthContext";
import { CommentsViewModel } from "../../../propuestas-comentarios/presentation/viewModels/CommentsViewModel";
import VotingHelpModal from "../../../propuestas-comentarios/presentation/components/VotingHelpModal";
import VotingCommentModal from "../../../propuestas-comentarios/presentation/components/VotingCommentModal";
import SectionCommentsModal from "../../../propuestas-comentarios/presentation/components/SectionCommentsModal";
import { PropuestaDetailViewModelInterface } from "../interfaces/PropuestaDetailViewModelInterface";
import { 
  FiCalendar, FiUser, FiBriefcase, FiFileText, FiTarget, FiTool, 
  FiActivity, FiClock, FiMail, FiGlobe, FiPhone, FiMapPin, FiBook,
  FiCheck, FiX, FiHelpCircle, FiMessageSquare, FiArrowLeft
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
  
  // ✅ NUEVO: Verificar voto final del tutor
  useEffect(() => {
    const checkTutorFinalVote = async () => {
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
      
      if (isTutorAcademico && propuesta.getId() && effectiveTutorId) {
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
          isTutorAcademico,
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
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FiArrowLeft className="w-5 h-5" />
                <span>Volver</span>
              </button>
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
                active={statusInfo.status === 'active'}
                label={statusInfo.label}
                className={statusInfo.color}
              />
              
              {/* Botones de votación - Solo para tutores académicos */}
              {isTutorAcademico && (
                <div className="flex flex-col items-end gap-2">
                  {/* Información sobre votación */}
                  <div className="flex items-center gap-2 text-xs text-gray-600 text-right">
                    <span>
                      <strong>Votación completa:</strong> Aprobar o rechazar toda la propuesta
                    </span>
                    <button
                      onClick={() => setShowHelpModal(true)}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                      title="Ver guía de votación"
                    >
                      <FiHelpCircle className="w-3 h-3 text-blue-600" />
                    </button>
                  </div>
                  
                  {!hasVoted ? (
                    // Mostrar botones de votación si no ha votado
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleVoteClick('APROBADO')}
                        disabled={commentsViewModel.loading}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                          commentsViewModel.loading 
                            ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                        title={commentsViewModel.loading ? "Procesando..." : "Aprobar esta propuesta completa"}
                      >
                        <FiCheck className="w-4 h-4" />
                        {commentsViewModel.loading ? 'Procesando...' : 'Aprobar Propuesta'}
                      </button>
                      
                      <button
                        onClick={() => handleVoteClick('RECHAZADO')}
                        disabled={commentsViewModel.loading}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                          commentsViewModel.loading 
                            ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                            : 'bg-red-600 text-white hover:bg-red-700'
                        }`}
                        title={commentsViewModel.loading ? "Procesando..." : "Rechazar esta propuesta completa"}
                      >
                        <FiX className="w-4 h-4" />
                        {commentsViewModel.loading ? 'Procesando...' : 'Rechazar Propuesta'}
                      </button>
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
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Columna principal - Información del proyecto */}
          <div className="xl:col-span-2 space-y-6">
            
            {/* Tipo de pasantía y fechas */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-blue-600 text-white">
                  {propuesta.getTipoPasantia()}
                </span>
                <div className="text-right">
                  <p className="text-xs text-blue-700">Duración del proyecto</p>
                  <p className="text-sm font-bold text-blue-900">
                    {propuesta.getProyecto().getDuracionDias()} días
                  </p>
                </div>
              </div>
            </div>

            {/* Contexto y Problemática */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <FiBook className="w-6 h-6 text-red-600" />
                <h3 className="text-xl font-bold text-gray-900">Contexto y Problemática</h3>
              </div>
              
              <div className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-900 mb-2">Contexto del Problema</h4>
                  <p className="text-red-800 leading-relaxed whitespace-pre-wrap">
                    {propuesta.getProyecto().getContextoProblema()}
                  </p>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-900 mb-2">Descripción del Problema</h4>
                  <p className="text-orange-800 leading-relaxed whitespace-pre-wrap">
                    {propuesta.getProyecto().getDescripcionProblema()}
                  </p>
                </div>
              </div>
              
              {/* ✅ NUEVO: Botón de comentario para tutores académicos */}
              {isTutorAcademico && !hasVoted && (
                <div className="mt-4 pt-4 border-t border-red-200">
                  <button
                    onClick={() => handleOpenCommentForm('Datos del Proyecto', 'Contexto y Problemática')}
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <FiMessageSquare className="w-4 h-4" />
                    Comentar esta sección
                  </button>
                </div>
              )}
              
            </div>

            {/* Objetivos */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <FiTarget className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-bold text-gray-900">Objetivos del Proyecto</h3>
              </div>
              
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">Objetivo General</h4>
                  <p className="text-green-800 leading-relaxed whitespace-pre-wrap">
                    {propuesta.getProyecto().getObjetivoGeneral()}
                  </p>
                </div>

                <div className="bg-emerald-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-emerald-900 mb-2">Objetivos Específicos</h4>
                  <p className="text-emerald-800 leading-relaxed whitespace-pre-wrap">
                    {propuesta.getProyecto().getObjetivosEspecificos()}
                  </p>
                </div>
              </div>
              
              {/* ✅ NUEVO: Botón de comentario para tutores académicos */}
              {isTutorAcademico && !hasVoted && (
                <div className="mt-4 pt-4 border-t border-green-200">
                  <button
                    onClick={() => handleOpenCommentForm('Datos del Proyecto', 'Objetivos del Proyecto')}
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    <FiMessageSquare className="w-4 h-4" />
                    Comentar esta sección
                  </button>
                </div>
              )}
              
            </div>

            {/* Actividades y Entregables */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <FiActivity className="w-6 h-6 text-purple-600" />
                <h3 className="text-xl font-bold text-gray-900">Actividades y Entregables</h3>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <FiActivity className="w-5 h-5 text-purple-600" />
                    <h4 className="font-semibold text-purple-900">Actividades Principales</h4>
                  </div>
                  <p className="text-purple-800 leading-relaxed whitespace-pre-wrap">
                    {propuesta.getProyecto().getActividadesPrincipales()}
                  </p>
                </div>

                <div className="bg-violet-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <FiFileText className="w-5 h-5 text-violet-600" />
                    <h4 className="font-semibold text-violet-900">Entregables Planeados</h4>
                  </div>
                  <p className="text-violet-800 leading-relaxed whitespace-pre-wrap">
                    {propuesta.getProyecto().getEntregablesPlaneados()}
                  </p>
                </div>
              </div>
              
              {/* ✅ NUEVO: Botón de comentario para tutores académicos */}
              {isTutorAcademico && !hasVoted && (
                <div className="mt-4 pt-4 border-t border-purple-200">
                  <button
                    onClick={() => handleOpenCommentForm('Datos del Proyecto', 'Actividades y Entregables')}
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                  >
                    <FiMessageSquare className="w-4 h-4" />
                    Comentar esta sección
                  </button>
                </div>
              )}
              
            </div>

            {/* Tecnologías */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <FiTool className="w-6 h-6 text-cyan-600" />
                <h3 className="text-xl font-bold text-gray-900">Tecnologías</h3>
              </div>
              
              <div className="bg-cyan-50 p-4 rounded-lg">
                <p className="text-cyan-800 leading-relaxed whitespace-pre-wrap">
                  {propuesta.getProyecto().getTecnologias()}
                </p>
              </div>
              
              {/* ✅ NUEVO: Botón de comentario para tutores académicos */}
              {isTutorAcademico && !hasVoted && (
                <div className="mt-4 pt-4 border-t border-cyan-200">
                  <button
                    onClick={() => handleOpenCommentForm('Datos del Proyecto', 'Tecnologías')}
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-cyan-100 text-cyan-700 rounded-lg hover:bg-cyan-200 transition-colors"
                  >
                    <FiMessageSquare className="w-4 h-4" />
                    Comentar esta sección
                  </button>
                </div>
              )}
              
            </div>

            {/* Período del proyecto */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <FiCalendar className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-bold text-gray-900">Período del Proyecto</h3>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="text-sm font-semibold text-green-700 mb-2">Fecha de Inicio</p>
                  <p className="text-green-900 font-bold text-lg">
                    {viewModel.formatDate(propuesta.getProyecto().getFechaInicio())}
                  </p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <p className="text-sm font-semibold text-red-700 mb-2">Fecha de Fin</p>
                  <p className="text-red-900 font-bold text-lg">
                    {viewModel.formatDate(propuesta.getProyecto().getFechaFin())}
                  </p>
                </div>
              </div>
              
              {/* ✅ NUEVO: Botón de comentario para tutores académicos */}
              {isTutorAcademico && !hasVoted && (
                <div className="mt-4 pt-4 border-t border-green-200">
                  <button
                    onClick={() => handleOpenCommentForm('Datos del Proyecto', 'Período del Proyecto')}
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    <FiMessageSquare className="w-4 h-4" />
                    Comentar esta sección
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Columna lateral - Información de empresa y contactos */}
          <div className="space-y-6">
            
            {/* Información de la Empresa */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <FiBriefcase className="w-6 h-6 text-purple-600" />
                <h3 className="text-xl font-bold text-gray-900">Empresa</h3>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 space-y-4">
                <div>
                  <p className="text-sm font-semibold text-purple-700 mb-1">Nombre Comercial</p>
                  <p className="text-purple-900 font-bold text-lg">
                    {propuesta.getEmpresa().getNombreCorto() || 'No especificado'}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-semibold text-purple-700 mb-1">Razón Social</p>
                  <p className="text-purple-900 font-medium">
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
                  <p className="text-purple-900 font-medium">
                    {propuesta.getEmpresa().getSector()}
                  </p>
                </div>

                {propuesta.getEmpresa().getPaginaWeb() && (
                  <div>
                    <p className="text-sm font-semibold text-purple-700 mb-1">Página Web</p>
                    <a 
                      href={propuesta.getEmpresa().getPaginaWeb()!} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-purple-900 underline hover:text-purple-700 flex items-center gap-2 font-medium break-all"
                    >
                      <FiGlobe className="w-4 h-4 flex-shrink-0" />
                      {propuesta.getEmpresa().getPaginaWeb()}
                    </a>
                  </div>
                )}

                {propuesta.getEmpresa().getLinkedIn() && (
                  <div>
                    <p className="text-sm font-semibold text-purple-700 mb-1">LinkedIn</p>
                    <a 
                      href={propuesta.getEmpresa().getLinkedIn()!} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-purple-900 underline hover:text-purple-700 font-medium break-all"
                    >
                      {propuesta.getEmpresa().getLinkedIn()}
                    </a>
                  </div>
                )}
              </div>
              
              {/* ✅ NUEVO: Botón de comentario para tutores académicos */}
              {isTutorAcademico && !hasVoted && (
                <div className="mt-4 pt-4 border-t border-purple-200">
                  <button
                    onClick={() => handleOpenCommentForm('Información de la Empresa', 'Datos de la Empresa')}
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                  >
                    <FiMessageSquare className="w-4 h-4" />
                    Comentar esta sección
                  </button>
                </div>
              )}
              
            </div>

            {/* Dirección de la Empresa */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <FiMapPin className="w-6 h-6 text-pink-600" />
                <h3 className="text-xl font-bold text-gray-900">Dirección</h3>
              </div>
              
              <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                <p className="text-pink-900 leading-relaxed">
                  {propuesta.getEmpresa().getDireccion().getDireccionCompleta()}
                </p>
              </div>
              
              {/* ✅ NUEVO: Botón de comentario para tutores académicos */}
              {isTutorAcademico && !hasVoted && (
                <div className="mt-4 pt-4 border-t border-pink-200">
                  <button
                    onClick={() => handleOpenCommentForm('Información de la Empresa', 'Dirección')}
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-pink-100 text-pink-700 rounded-lg hover:bg-pink-200 transition-colors"
                  >
                    <FiMessageSquare className="w-4 h-4" />
                    Comentar esta sección
                  </button>
                </div>
              )}
            </div>

            {/* Persona de Contacto */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <FiPhone className="w-6 h-6 text-orange-600" />
                <h3 className="text-xl font-bold text-gray-900">Persona de Contacto</h3>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 space-y-3">
                <div>
                  <p className="text-sm font-semibold text-orange-700 mb-1">Nombre</p>
                  <p className="text-orange-900 font-bold">
                    {propuesta.getContacto().getNombre()}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-orange-700 mb-1">Puesto</p>
                  <p className="text-orange-900 font-medium">
                    {propuesta.getContacto().getPuesto()}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-orange-700 mb-1">Área</p>
                  <p className="text-orange-900 font-medium">
                    {propuesta.getContacto().getArea()}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-orange-700 mb-1">Email</p>
                  <a 
                    href={`mailto:${propuesta.getContacto().getEmail()}`}
                    className="text-orange-900 hover:text-orange-700 font-medium break-all flex items-center gap-2"
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
              
              {/* ✅ NUEVO: Botón de comentario para tutores académicos */}
              {isTutorAcademico && !hasVoted && (
                <div className="mt-4 pt-4 border-t border-orange-200">
                  <button
                    onClick={() => handleOpenCommentForm('Información de Contacto', 'Persona de Contacto')}
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
                  >
                    <FiMessageSquare className="w-4 h-4" />
                    Comentar esta sección
                  </button>
                </div>
              )}
            </div>

            {/* Supervisor del Proyecto */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <FiUser className="w-6 h-6 text-teal-600" />
                <h3 className="text-xl font-bold text-gray-900">Supervisor del Proyecto</h3>
              </div>
              
              <div className="bg-teal-50 p-4 rounded-lg border border-teal-200 space-y-3">
                <div>
                  <p className="text-sm font-semibold text-teal-700 mb-1">Nombre</p>
                  <p className="text-teal-900 font-bold">
                    {propuesta.getSupervisor().getNombre()}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-teal-700 mb-1">Área</p>
                  <p className="text-teal-900 font-medium">
                    {propuesta.getSupervisor().getArea()}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-teal-700 mb-1">Email</p>
                  <a 
                    href={`mailto:${propuesta.getSupervisor().getEmail()}`}
                    className="text-teal-900 hover:text-teal-700 font-medium break-all flex items-center gap-2"
                  >
                    <FiMail className="w-4 h-4 flex-shrink-0" />
                    {propuesta.getSupervisor().getEmail()}
                  </a>
                </div>

                <div>
                  <p className="text-sm font-semibold text-teal-700 mb-1">Teléfono</p>
                  <a 
                    href={`tel:${propuesta.getSupervisor().getTelefono()}`}
                    className="text-teal-900 hover:text-teal-700 font-medium"
                  >
                    {propuesta.getSupervisor().getTelefono()}
                  </a>
                </div>
              </div>
              
              {/* ✅ NUEVO: Botón de comentario para tutores académicos */}
              {isTutorAcademico && !hasVoted && (
                <div className="mt-4 pt-4 border-t border-teal-200">
                  <button
                    onClick={() => handleOpenCommentForm('Supervisor del Proyecto', 'Información del Supervisor')}
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition-colors"
                  >
                    <FiMessageSquare className="w-4 h-4" />
                    Comentar esta sección
                  </button>
                </div>
              )}
            </div>

            {/* Información del Estudiante */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <FiUser className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Información del Estudiante</h3>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 space-y-3">
                <div>
                  <p className="text-sm font-semibold text-blue-700 mb-1">Nombre Completo</p>
                  <p className="text-blue-900 font-bold text-lg">
                    {propuesta.getEstudiante().getNombreCompleto()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-700 mb-1">Correo Electrónico</p>
                  <a 
                    href={`mailto:${propuesta.getEstudiante().getEmail()}`}
                    className="text-blue-900 hover:text-blue-700 font-medium break-all flex items-center gap-2"
                  >
                    <FiMail className="w-4 h-4 flex-shrink-0" />
                    {propuesta.getEstudiante().getEmail()}
                  </a>
                </div>
              </div>
              
            </div>

            {/* Tutor Académico */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <FiUser className="w-6 h-6 text-indigo-600" />
                <h3 className="text-xl font-bold text-gray-900">Tutor Académico</h3>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                <p className="font-bold text-indigo-900 text-lg mb-2">
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
              
              {/* ✅ NUEVO: Botón de comentario para tutores académicos */}
              {isTutorAcademico && !hasVoted && (
                <div className="mt-4 pt-4 border-t border-indigo-200">
                  <button
                    onClick={() => handleOpenCommentForm('Tutor Académico', 'Información del Tutor')}
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                  >
                    <FiMessageSquare className="w-4 h-4" />
                    Comentar esta sección
                  </button>
                </div>
              )}
            </div>

            {/* Información de timestamps */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <FiClock className="w-6 h-6 text-gray-600" />
                <h3 className="text-xl font-bold text-gray-900">Registro</h3>
              </div>
              <div className="space-y-3">
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <p className="text-sm text-green-700 font-semibold mb-1">Fecha de registro</p>
                  <p className="text-sm text-green-900 font-medium">
                    {viewModel.formatDateTime(propuesta.getCreatedAt())}
                  </p>
                </div>
                {propuesta.getUpdatedAt() && propuesta.getUpdatedAt()?.getTime() !== propuesta.getCreatedAt()?.getTime() && (
                  <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                    <p className="text-sm text-yellow-700 font-semibold mb-1">Última actualización</p>
                    <p className="text-sm text-yellow-900 font-medium">
                      {viewModel.formatDateTime(propuesta.getUpdatedAt()!)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* ID único */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-600">
                <span className="font-semibold">ID de Propuesta:</span> 
                <span className="font-mono ml-1">{propuesta.getId()}</span>
              </p>
            </div>

            {/* Información para tutores académicos */}
            {isTutorAcademico && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Información para Tutores Académicos</h3>
                <ul className="text-sm text-blue-800 space-y-1">
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
