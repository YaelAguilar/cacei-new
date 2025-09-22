// src/features/shared/components/PropuestaDetailModal.tsx
import React, { useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import { motion } from "framer-motion";
import { AiOutlineClose } from "react-icons/ai";
import { PropuestaCompleta } from "../../alumnos-propuestas/data/models/Propuesta";
import Status from "./Status";
import { 
  FiCalendar, FiUser, FiBriefcase, FiFileText, FiTarget, FiTool, 
  FiActivity, FiClock, FiMail, FiGlobe, FiPhone, FiMapPin, FiBook,
  FiMessageCircle, FiChevronDown, FiChevronUp, FiCheckCircle, FiAlertTriangle
} from "react-icons/fi";
import { CommentsViewModel } from "../../propuestas-comentarios/presentation/viewModels/CommentsViewModel";
import InlineComments from "../../propuestas-comentarios/presentation/components/InlineComments";
import { ProposalComment } from "../../propuestas-comentarios/data/models/ProposalComment";
import { useAuth } from "../../../core/utils/AuthContext";

// Interface genérica para el ViewModel
export interface PropuestaDetailViewModelInterface {
  getPropuestaStatus(propuesta: PropuestaCompleta): {
    status: 'active' | 'inactive';
    label: string;
    color: string;
  };
  formatDate(date: Date): string;
  formatDateTime(date: Date): string;
}

interface PropuestaDetailModalProps {
  propuesta: PropuestaCompleta;
  viewModel: PropuestaDetailViewModelInterface;
  onClose: () => void;
}

const PropuestaDetailModal: React.FC<PropuestaDetailModalProps> = observer(({ 
  propuesta, 
  viewModel, 
  onClose 
}) => {
  const statusInfo = viewModel.getPropuestaStatus(propuesta);
  const authViewModel = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [showApprovalConfirmation, setShowApprovalConfirmation] = useState(false);
  
  // Crear instancia del ViewModel de comentarios
  const commentsViewModel = useMemo(() => new CommentsViewModel(), []);
  
  // Verificar si el usuario puede comentar (es tutor)
  const canComment = authViewModel.userRoles.some(role => 
    ['PTC', 'PA', 'Director'].includes(role.name)
  );
  
  const currentUserEmail = authViewModel.currentUser?.getEmail();

  // Inicializar comentarios cuando se abre el modal
  useEffect(() => {
    const initializeComments = async () => {
      try {
        // Usar el UUID de la propuesta (getId() devuelve el UUID)
        const proposalUuid = propuesta.getId();
        
        console.log('🔍 Inicializando comentarios...');
        console.log('📦 UUID de propuesta:', proposalUuid);
        
        await commentsViewModel.initialize(propuesta.getId());
      } catch (error) {
        console.error("Error al cargar comentarios:", error);
      }
    };

    initializeComments();

    return () => {
      commentsViewModel.reset();
    };
}, [propuesta, commentsViewModel]);

  // Función para obtener todos los comentarios agrupados por sección
  const getCommentsBySection = () => {
    const allComments = commentsViewModel.comments || [];
    const commentsBySection: Record<string, ProposalComment[]> = {};
    
    allComments.forEach((comment: ProposalComment) => {
      const sectionKey = `${comment.getSectionName()} - ${comment.getSubsectionName()}`;
      if (!commentsBySection[sectionKey]) {
        commentsBySection[sectionKey] = [];
      }
      commentsBySection[sectionKey].push(comment);
    });
    
    return commentsBySection;
  };

  // ✅ NUEVO: Lógica para aprobar toda la propuesta
  const isFullyApproved = commentsViewModel.isProposalFullyApproved;
  const hasAnyComments = commentsViewModel.hasComments;
  const hasTutorCommentedInProposal = currentUserEmail ? 
    commentsViewModel.comments.some(comment => comment.getTutorEmail() === currentUserEmail) : false;

  const handleApproveProposal = async () => {
    if (hasAnyComments) {
      // Mostrar confirmación si ya hay comentarios
      setShowApprovalConfirmation(true);
    } else {
      // Proceder directamente si no hay comentarios
      await executeApproval();
    }
  };

  const executeApproval = async () => {
    const success = await commentsViewModel.approveProposal(propuesta.getId());
    if (success) {
      console.log('✅ Propuesta aprobada completamente');
      setShowApprovalConfirmation(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/20 backdrop-blur-xs flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white p-4 rounded-lg shadow-lg max-w-7xl mx-auto w-[95%] h-[90vh] flex flex-col"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-row items-center justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-900 truncate">
              {propuesta.getProyecto().getNombre()}
            </h1>
            <p className="text-md font-light text-gray-600">Detalles completos de la propuesta</p>
          </div>
          <div className="flex items-center gap-4 ml-4">
            <Status 
              active={statusInfo.status === 'active'}
              label={statusInfo.label}
              className={statusInfo.color}
            />
            
            {/* ✅ ÚNICO BOTÓN DE APROBAR TODO - Posicionado en el header */}
            {canComment && !isFullyApproved && !hasTutorCommentedInProposal && (
              <button
                onClick={handleApproveProposal}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                title="Aprobar toda la propuesta sin comentarios específicos"
              >
                <FiCheckCircle className="w-4 h-4" />
                Aprobar Propuesta Completa
              </button>
            )}

            <button 
              onClick={onClose} 
              className="text-blue-500 hover:bg-blue-100 rounded-full p-3 cursor-pointer"
            >
              <AiOutlineClose size={17} />
            </button>
          </div>
        </div>

        {/* ✅ CONFIRMACIÓN DE APROBACIÓN GLOBAL */}
        {showApprovalConfirmation && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-3">
              <FiAlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-yellow-800 mb-2">
                  ⚠️ Confirmar Aprobación Total de la Propuesta
                </h4>
                <p className="text-sm text-yellow-700 mb-3">
                  Ya existen comentarios específicos en esta propuesta. Para aprobar toda la propuesta, 
                  se eliminarán todos los comentarios existentes y se marcará como completamente aprobada.
                </p>
                <p className="text-sm font-medium text-yellow-800 mb-3">
                  ¿Está seguro de que desea continuar?
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={executeApproval}
                    className="px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                  >
                    Sí, Aprobar Propuesta Completa
                  </button>
                  <button
                    onClick={() => setShowApprovalConfirmation(false)}
                    className="px-3 py-1.5 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ✅ MENSAJE INFORMATIVO PARA USUARIOS QUE YA COMENTARON */}
        {canComment && hasTutorCommentedInProposal && !isFullyApproved && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Información:</strong> Ya has realizado comentarios en esta propuesta. 
              Solo los tutores que no han comentado pueden aprobar la propuesta completa.
            </p>
          </div>
        )}

        {/* ✅ MENSAJE DE PROPUESTA APROBADA */}
        {isFullyApproved && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <FiCheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-sm text-green-800 font-medium">
                ✅ Esta propuesta ha sido aprobada en su totalidad.
              </p>
            </div>
          </div>
        )}

        {/* Error de aprobación */}
        {commentsViewModel.error && commentsViewModel.error.includes("comentarios específicos") && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
            <strong>❌ Error:</strong> {commentsViewModel.error}
          </div>
        )}

        {/* Resumen de Comentarios y botón para ver todos los comentarios */}
        {canComment && (
          <div className="flex items-center justify-between mb-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium text-gray-800">Resumen de Revisión:</span>
                <span className="ml-2">
                  {commentsViewModel.statistics.total > 0 ? (
                    <>
                      <span className="text-green-600 font-medium">{commentsViewModel.statistics.approved} ✓</span>
                      <span className="mx-1">·</span>
                      <span className="text-red-600 font-medium">{commentsViewModel.statistics.rejected} ✗</span>
                      <span className="mx-1">·</span>
                      <span className="text-yellow-600 font-medium">{commentsViewModel.statistics.needsUpdate} ↻</span>
                    </>
                  ) : (
                    <span className="text-gray-500">Sin comentarios</span>
                  )}
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md transition-colors duration-200 text-sm"
            >
              <FiMessageCircle className="w-4 h-4" />
              <span className="font-medium">
                {showComments ? 'Ocultar' : 'Ver todos'}
              </span>
              {showComments ? (
                <FiChevronUp className="w-3 h-3" />
              ) : (
                <FiChevronDown className="w-3 h-3" />
              )}
            </button>
          </div>
        )}

        {/* Sección de comentarios desplegable */}
        {canComment && showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6 overflow-hidden"
          >
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-80 overflow-y-auto">
              <div className="flex items-center gap-2 mb-4">
                <FiMessageCircle className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Todos los comentarios del proyecto
                </h3>
              </div>
              
              {Object.keys(getCommentsBySection()).length === 0 ? (
                <div className="text-center py-8">
                  <FiMessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No hay comentarios en esta propuesta aún.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(getCommentsBySection()).map(([sectionKey, comments]) => (
                    <div key={sectionKey} className="bg-white rounded-lg p-4 border border-gray-200">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        {sectionKey}
                      </h4>
                      <div className="space-y-3">
                        {comments.map((comment: ProposalComment, index: number) => (
                          <div key={index} className="bg-gray-50 rounded-md p-3 border-l-4 border-blue-400">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">
                                {comment.getTutorEmail()}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${comment.getVoteStatusColor()}`}>
                                  {comment.getVoteStatusIcon()} {comment.getVoteStatus()}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {commentsViewModel.formatDate(comment.getCreatedAt())}
                                </span>
                              </div>
                            </div>
                            <p className="text-gray-800 text-sm leading-relaxed">
                              {comment.getCommentText()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Contenido con scroll */}
        <div className="flex-1 overflow-y-auto">
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
                    
                    <InlineComments
                      viewModel={commentsViewModel}
                      proposalId={propuesta.getId()}
                      sectionName="Contexto y Problemática"
                      subsectionName="Contexto del Problema"
                      currentUserEmail={currentUserEmail}
                      canComment={canComment}
                    />
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-orange-900 mb-2">Descripción del Problema</h4>
                    <p className="text-orange-800 leading-relaxed whitespace-pre-wrap">
                      {propuesta.getProyecto().getDescripcionProblema()}
                    </p>
                    
                    <InlineComments
                      viewModel={commentsViewModel}
                      proposalId={propuesta.getId()}
                      sectionName="Contexto y Problemática"
                      subsectionName="Descripción del Problema"
                      currentUserEmail={currentUserEmail}
                      canComment={canComment}
                    />
                  </div>
                </div>
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
                    
                    <InlineComments
                      viewModel={commentsViewModel}
                      proposalId={propuesta.getId()}
                      sectionName="Objetivos del Proyecto"
                      subsectionName="Objetivo General"
                      currentUserEmail={currentUserEmail}
                      canComment={canComment}
                    />
                  </div>

                  <div className="bg-emerald-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-emerald-900 mb-2">Objetivos Específicos</h4>
                    <p className="text-emerald-800 leading-relaxed whitespace-pre-wrap">
                      {propuesta.getProyecto().getObjetivosEspecificos()}
                    </p>
                    
                    <InlineComments
                      viewModel={commentsViewModel}
                      proposalId={propuesta.getId()}
                      sectionName="Objetivos del Proyecto"
                      subsectionName="Objetivos Específicos"
                      currentUserEmail={currentUserEmail}
                      canComment={canComment}
                    />
                  </div>
                </div>
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
                    
                    <InlineComments
                      viewModel={commentsViewModel}
                      proposalId={propuesta.getId()}
                      sectionName="Plan de Trabajo"
                      subsectionName="Actividades Principales"
                      currentUserEmail={currentUserEmail}
                      canComment={canComment}
                    />
                  </div>

                  <div className="bg-violet-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <FiFileText className="w-5 h-5 text-violet-600" />
                      <h4 className="font-semibold text-violet-900">Entregables Planeados</h4>
                    </div>
                    <p className="text-violet-800 leading-relaxed whitespace-pre-wrap">
                      {propuesta.getProyecto().getEntregablesPlaneados()}
                    </p>
                    
                    <InlineComments
                      viewModel={commentsViewModel}
                      proposalId={propuesta.getId()}
                      sectionName="Plan de Trabajo"
                      subsectionName="Entregables Planeados"
                      currentUserEmail={currentUserEmail}
                      canComment={canComment}
                    />
                  </div>
                </div>
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
                  
                  <InlineComments
                    viewModel={commentsViewModel}
                    proposalId={propuesta.getId()}
                    sectionName="Plan de Trabajo"
                    subsectionName="Tecnologías"
                    currentUserEmail={currentUserEmail}
                    canComment={canComment}
                  />
                </div>
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
                
                <InlineComments
                  viewModel={commentsViewModel}
                  proposalId={propuesta.getId()}
                  sectionName="Calendario"
                  subsectionName="Fechas del Proyecto"
                  currentUserEmail={currentUserEmail}
                  canComment={canComment}
                />
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
                      {propuesta.getEmpresa().getNombreCorto()}
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
                
                <InlineComments
                  viewModel={commentsViewModel}
                  proposalId={propuesta.getId()}
                  sectionName="Información de la Empresa"
                  subsectionName="Datos Generales"
                  currentUserEmail={currentUserEmail}
                  canComment={canComment}
                />
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
                
                <InlineComments
                  viewModel={commentsViewModel}
                  proposalId={propuesta.getId()}
                  sectionName="Información de la Empresa"
                  subsectionName="Dirección"
                  currentUserEmail={currentUserEmail}
                  canComment={canComment}
                />
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
                
                <InlineComments
                  viewModel={commentsViewModel}
                  proposalId={propuesta.getId()}
                  sectionName="Información de la Empresa"
                  subsectionName="Información de Contacto"
                  currentUserEmail={currentUserEmail}
                  canComment={canComment}
                />
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
                
                <InlineComments
                  viewModel={commentsViewModel}
                  proposalId={propuesta.getId()}
                  sectionName="Supervisor del Proyecto"
                  subsectionName="Información del Supervisor"
                  currentUserEmail={currentUserEmail}
                  canComment={canComment}
                />
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
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});

export default PropuestaDetailModal;