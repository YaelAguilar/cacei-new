// src/features/alumnos-propuestas/presentation/components/PropuestaDetailModal.tsx
import React from "react";
import { observer } from "mobx-react-lite";
import { motion } from "framer-motion";
import { AiOutlineClose } from "react-icons/ai";
import { Propuesta } from "../../data/models/Propuesta";
import { VisualizarPropuestasViewModel } from "../viewModels/VisualizarPropuestasViewModel";
import Status from "../../../shared/components/Status";
import { 
  FiCalendar, FiUser, FiBriefcase, FiFileText, FiTarget, FiTool, 
  FiActivity, FiClock, FiMail, FiGlobe, FiMapPin, FiPhone, FiBuilding 
} from "react-icons/fi";

interface PropuestaDetailModalProps {
  propuesta: Propuesta;
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
        {/* Header del modal */}
        <div className="flex flex-row items-center justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-900 truncate">
              {propuesta.getProyecto().getNombre()}
            </h1>
            <p className="text-md font-light text-gray-600">Detalles completos de la propuesta de proyecto</p>
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
              <AiOutlineClose size={17} className="text-blue-500" />
            </button>
          </div>
        </div>

        {/* Contenido del modal */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">
            
            {/* Columna izquierda - Información del proyecto */}
            <div className="xl:col-span-2 space-y-6">
              
              {/* Tipo de pasantía */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-blue-600 text-white">
                  {propuesta.getTipoPasantia()}
                </span>
              </div>

              {/* Información del Proyecto */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FiFileText className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-bold text-gray-900">Información del Proyecto</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-3">Descripción</h4>
                    <p className="text-blue-800 leading-relaxed">
                      {propuesta.getProyecto().getDescripcion()}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <FiTarget className="w-5 h-5 text-gray-600" />
                        <h4 className="font-semibold text-gray-900">Entregables</h4>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        {propuesta.getProyecto().getEntregables()}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <FiTool className="w-5 h-5 text-gray-600" />
                        <h4 className="font-semibold text-gray-900">Tecnologías</h4>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        {propuesta.getProyecto().getTecnologias()}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <FiActivity className="w-5 h-5 text-gray-600" />
                      <h4 className="font-semibold text-gray-900">Actividades a Realizar</h4>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {propuesta.getProyecto().getActividades()}
                    </p>
                  </div>
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

            {/* Columna derecha - Información de contactos y empresa */}
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
                    <p className="text-purple-900 font-bold text-lg truncate">
                      {propuesta.getEmpresa().getNombre()}
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
                    <p className="text-orange-900 font-medium">
                      {propuesta.getEmpresa().getPersonaContacto()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Supervisor del Proyecto */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FiBuilding className="w-6 h-6 text-teal-600" />
                  <h3 className="text-xl font-bold text-gray-900">Supervisor del Proyecto</h3>
                </div>
                
                <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                  <p className="font-bold text-teal-900 text-lg mb-2">
                    {propuesta.getProyecto().getSupervisor()}
                  </p>
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