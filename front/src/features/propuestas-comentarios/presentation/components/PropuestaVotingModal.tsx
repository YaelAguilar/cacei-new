// src/features/propuestas-comentarios/presentation/components/PropuestaVotingModal.tsx
import React, { useEffect, useMemo } from "react";
import { observer } from "mobx-react-lite";
import { motion } from "framer-motion";
import { AiOutlineClose } from "react-icons/ai";
import { PropuestaCompleta } from "../../../alumnos-propuestas/data/models/Propuesta";
import Status from "../../../shared/components/Status";
import { CommentsViewModel } from "../viewModels/CommentsViewModel";
import InlineComments from "./InlineComments";
import { 
  FiCalendar, FiUser, FiBriefcase, FiFileText, FiTarget, FiTool, 
  FiActivity, FiClock, FiMail, FiGlobe, FiPhone, FiMapPin, FiBook
} from "react-icons/fi";
import { useAuth } from "../../../../core/utils/AuthContext";

// Interface para el ViewModel
export interface PropuestaVotingViewModelInterface {
  getPropuestaStatus(propuesta: PropuestaCompleta): {
    status: 'active' | 'inactive';
    label: string;
    color: string;
  };
  formatDate(date: Date): string;
  formatDateTime(date: Date): string;
}

interface PropuestaVotingModalProps {
  propuesta: PropuestaCompleta;
  viewModel: PropuestaVotingViewModelInterface;
  onClose: () => void;
}

const PropuestaVotingModal: React.FC<PropuestaVotingModalProps> = observer(({ 
  propuesta, 
  viewModel, 
  onClose 
}) => {
  const authViewModel = useAuth();
  const commentsViewModel = useMemo(() => new CommentsViewModel(), []);

  // Cargar comentarios cuando se abre el modal
  useEffect(() => {
    const loadComments = async () => {
      try {
        await commentsViewModel.loadComments(propuesta.getId());
      } catch (error) {
        console.error("Error al cargar comentarios:", error);
      }
    };

    loadComments();
  }, [commentsViewModel, propuesta.getId()]);

  const statusInfo = viewModel.getPropuestaStatus(propuesta);

  // Definir las secciones de la propuesta para votación
  const propuestaSections = [
    {
      name: "Información del Estudiante",
      subsections: [
        { name: "Datos Personales", key: "datosPersonales" },
        { name: "Información Académica", key: "infoAcademica" }
      ]
    },
    {
      name: "Información de la Empresa",
      subsections: [
        { name: "Datos de la Empresa", key: "datosEmpresa" },
        { name: "Dirección y Contacto", key: "direccionContacto" }
      ]
    },
    {
      name: "Información del Supervisor",
      subsections: [
        { name: "Datos del Supervisor", key: "datosSupervisor" }
      ]
    },
    {
      name: "Información del Proyecto",
      subsections: [
        { name: "Descripción del Proyecto", key: "descripcionProyecto" },
        { name: "Objetivos y Actividades", key: "objetivosActividades" },
        { name: "Tecnologías y Entregables", key: "tecnologiasEntregables" }
      ]
    }
  ];

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
              {propuesta.getProyecto()?.getNombre() || 'Proyecto sin nombre'}
            </h1>
            <p className="text-md font-light text-gray-600">Revisar y votar sobre la propuesta</p>
          </div>
          <div className="flex items-center gap-4 ml-4">
            <Status 
              active={statusInfo.status === 'active'}
              label={statusInfo.label}
              className={statusInfo.color}
            />
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <AiOutlineClose className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="flex-1 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            
            {/* Columna principal - Información de la propuesta */}
            <div className="lg:col-span-2 overflow-y-auto space-y-6">
              
              {/* Información del Estudiante */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FiUser className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-bold text-gray-900">Información del Estudiante</h3>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="font-bold text-blue-900 text-lg mb-2">
                    {propuesta.getEstudiante().getNombreCompleto()}
                  </p>
                  <div className="flex items-center gap-2 mb-2">
                    <FiMail className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span className="text-blue-700 font-medium">
                      {propuesta.getEstudiante().getEmail()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiPhone className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span className="text-blue-700 font-medium">
                      No disponible
                    </span>
                  </div>
                </div>
                
                {/* Comentarios para esta sección */}
                <InlineComments
                  viewModel={commentsViewModel}
                  proposalId={propuesta.getId()}
                  sectionName="Información del Estudiante"
                  subsectionName="Datos Personales"
                  currentUserEmail={authViewModel.currentUser?.getEmail()}
                  canComment={true}
                />
              </div>

              {/* Información de la Empresa */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FiBriefcase className="w-6 h-6 text-purple-600" />
                  <h3 className="text-xl font-bold text-gray-900">Información de la Empresa</h3>
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
                </div>
                
                {/* Comentarios para esta sección */}
                <InlineComments
                  viewModel={commentsViewModel}
                  proposalId={propuesta.getId()}
                  sectionName="Información de la Empresa"
                  subsectionName="Datos de la Empresa"
                  currentUserEmail={authViewModel.currentUser?.getEmail()}
                  canComment={true}
                />
              </div>

              {/* Información del Proyecto */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FiFileText className="w-6 h-6 text-green-600" />
                  <h3 className="text-xl font-bold text-gray-900">Información del Proyecto</h3>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200 space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-green-700 mb-1">Nombre del Proyecto</p>
                    <p className="text-green-900 font-bold text-lg">
                      {propuesta.getProyecto()?.getNombre() || 'Proyecto sin nombre'}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-semibold text-green-700 mb-1">Fecha de Inicio</p>
                      <p className="text-green-900 font-medium">
                        {viewModel.formatDate(propuesta.getProyecto()?.getFechaInicio() || new Date())}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-green-700 mb-1">Fecha de Fin</p>
                      <p className="text-green-900 font-medium">
                        {viewModel.formatDate(propuesta.getProyecto()?.getFechaFin() || new Date())}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-green-700 mb-1">Contexto del Problema</p>
                    <p className="text-green-900 text-sm leading-relaxed">
                      {propuesta.getProyecto()?.getContextoProblema() || 'No especificado'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-green-700 mb-1">Objetivo General</p>
                    <p className="text-green-900 text-sm leading-relaxed">
                      {propuesta.getProyecto()?.getObjetivoGeneral() || 'No especificado'}
                    </p>
                  </div>
                </div>
                
                {/* Comentarios para esta sección */}
                <InlineComments
                  viewModel={commentsViewModel}
                  proposalId={propuesta.getId()}
                  sectionName="Información del Proyecto"
                  subsectionName="Descripción del Proyecto"
                  currentUserEmail={authViewModel.currentUser?.getEmail()}
                  canComment={true}
                />
              </div>
            </div>

            {/* Columna lateral - Información adicional */}
            <div className="space-y-6 overflow-y-auto">
              
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
                  <h3 className="text-xl font-bold text-gray-900">Información de Registro</h3>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">Fecha de Creación</p>
                    <p className="text-gray-900 font-medium">
                      {viewModel.formatDateTime(propuesta.getCreatedAt())}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">Última Actualización</p>
                    <p className="text-gray-900 font-medium">
                      {viewModel.formatDateTime(propuesta.getUpdatedAt())}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});

export default PropuestaVotingModal;


