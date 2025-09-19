// front/src/features/alumnos-propuestas/presentation/components/PropuestaDetailModal.tsx
import React from "react";
import { observer } from "mobx-react-lite";
import { motion } from "framer-motion";
import { AiOutlineClose } from "react-icons/ai";
import { PropuestaCompleta } from "../../data/models/Propuesta";
import { VisualizarPropuestasViewModel } from "../viewModels/VisualizarPropuestasViewModel";
import Status from "../../../shared/components/Status";
import { 
  FiCalendar, FiUser, FiBriefcase, FiFileText, FiTarget, FiTool, 
  FiActivity, FiClock, FiMail, FiGlobe, FiPhone, FiMapPin, FiBook
} from "react-icons/fi";

interface PropuestaDetailModalProps {
  propuesta: PropuestaCompleta;
  viewModel: VisualizarPropuestasViewModel;
  onClose: () => void;
}

const PropuestaDetailModal: React.FC<PropuestaDetailModalProps> = observer(({ 
  propuesta, 
  viewModel, 
  onClose 
}) => {
  const statusInfo = viewModel.getPropuestaStatus(propuesta);

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
            <button 
              onClick={onClose} 
              className="text-blue-500 hover:bg-blue-100 rounded-full p-3 cursor-pointer"
            >
              <AiOutlineClose size={17} />
            </button>
          </div>
        </div>

        {/* Contenido */}
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
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-orange-900 mb-2">Descripción del Problema</h4>
                    <p className="text-orange-800 leading-relaxed whitespace-pre-wrap">
                      {propuesta.getProyecto().getDescripcionProblema()}
                    </p>
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
                  </div>

                  <div className="bg-emerald-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-emerald-900 mb-2">Objetivos Específicos</h4>
                    <p className="text-emerald-800 leading-relaxed whitespace-pre-wrap">
                      {propuesta.getProyecto().getObjetivosEspecificos()}
                    </p>
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