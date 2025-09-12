// src/features/alumnos-propuestas/presentation/components/PropuestaDetailModal.tsx
import React from "react";
import { observer } from "mobx-react-lite";
import { Propuesta } from "../../data/models/Propuesta";
import { VisualizarPropuestasViewModel } from "../viewModels/VisualizarPropuestasViewModel";
import Modal from "../../../shared/layout/Modal";
import Status from "../../../shared/components/Status";
// Cambios: FiBuilding no existe (usar FiBriefcase), quitar FiTag no usado
import { FiCalendar, FiUser, FiBriefcase, FiFileText, FiTarget, FiTool, FiActivity, FiClock, FiMail, FiGlobe } from "react-icons/fi";

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
    <Modal
      title={propuesta.getProyecto().getNombre()}
      subtitle="Detalles completos de la propuesta de proyecto"
      onClose={onClose}
    >
      <div className="mt-6 max-h-[80vh] overflow-y-auto space-y-6">
        {/* Estado y tipo de pasantía */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <Status 
            active={statusInfo.status === 'active'}
            label={statusInfo.label}
            className={statusInfo.color}
          />
          <div className="text-right">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {propuesta.getTipoPasantia()}
            </span>
          </div>
        </div>

        {/* Información del Proyecto */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FiFileText className="w-5 h-5 text-gray-500" />
            <h4 className="font-semibold text-gray-900">Información del Proyecto</h4>
          </div>
          
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h5 className="font-medium text-blue-900 mb-2">Descripción</h5>
              <p className="text-blue-800 text-sm">
                {propuesta.getProyecto().getDescripcion()}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FiTarget className="w-4 h-4 text-gray-600" />
                  <h5 className="font-medium text-gray-900">Entregables</h5>
                </div>
                <p className="text-gray-700 text-sm">
                  {propuesta.getProyecto().getEntregables()}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FiTool className="w-4 h-4 text-gray-600" />
                  <h5 className="font-medium text-gray-900">Tecnologías</h5>
                </div>
                <p className="text-gray-700 text-sm">
                  {propuesta.getProyecto().getTecnologias()}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FiActivity className="w-4 h-4 text-gray-600" />
                <h5 className="font-medium text-gray-900">Actividades a Realizar</h5>
              </div>
              <p className="text-gray-700 text-sm">
                {propuesta.getProyecto().getActividades()}
              </p>
            </div>
          </div>
        </div>

        {/* Período del proyecto */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FiCalendar className="w-5 h-5 text-gray-500" />
            <h4 className="font-semibold text-gray-900">Período del Proyecto</h4>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-green-700 mb-1">Fecha de Inicio</p>
              <p className="text-green-900 font-medium">
                {viewModel.formatDate(propuesta.getProyecto().getFechaInicio())}
              </p>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-red-700 mb-1">Fecha de Fin</p>
              <p className="text-red-900 font-medium">
                {viewModel.formatDate(propuesta.getProyecto().getFechaFin())}
              </p>
            </div>
          </div>
        </div>

        {/* Información de la Empresa */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FiBriefcase className="w-5 h-5 text-gray-500" />
            <h4 className="font-semibold text-gray-900">Información de la Empresa</h4>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg space-y-3">
            <div>
              <p className="text-sm font-medium text-purple-700 mb-1">Nombre de la Empresa</p>
              <p className="text-purple-900 font-medium">
                {/* Cambio: usar el método correcto de la empresa */}
                {propuesta.getEmpresa().getNombre()}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-purple-700 mb-1">Sector</p>
                <p className="text-purple-900">
                  {/* Cambio: usar el método correcto de la empresa */}
                  {propuesta.getEmpresa().getSector()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-purple-700 mb-1">Persona de Contacto</p>
                <p className="text-purple-900">
                  {/* Cambio: usar el método correcto de la empresa o propuesta */}
                  {propuesta.getEmpresa().getPersonaContacto?.() || 'No especificada'}
                </p>
              </div>
            </div>

            {propuesta.getEmpresa().getPaginaWeb() && (
              <div>
                <p className="text-sm font-medium text-purple-700 mb-1">Página Web</p>
                <a 
                  href={propuesta.getEmpresa().getPaginaWeb()!} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-900 underline hover:text-purple-700 flex items-center gap-1"
                >
                  <FiGlobe className="w-4 h-4" />
                  {propuesta.getEmpresa().getPaginaWeb()}
                </a>
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-purple-700 mb-1">Supervisor del Proyecto</p>
              <p className="text-purple-900">
                {/* Cambio: usar el método correcto de la empresa o proporcionar valor por defecto */}
                {propuesta.getProyecto().getSupervisor?.() || 'No especificado'}
              </p>
            </div>
          </div>
        </div>

        {/* Tutor Académico */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FiUser className="w-5 h-5 text-gray-500" />
            <h4 className="font-semibold text-gray-900">Tutor Académico</h4>
          </div>
          <div className="bg-indigo-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-indigo-900">
                  {propuesta.getTutorAcademico().getNombre()}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <FiMail className="w-4 h-4 text-indigo-600" />
                  <a 
                    href={`mailto:${propuesta.getTutorAcademico().getEmail()}`}
                    className="text-indigo-700 hover:text-indigo-800 text-sm"
                  >
                    {propuesta.getTutorAcademico().getEmail()}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Información de timestamps */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FiClock className="w-5 h-5 text-gray-500" />
            <h4 className="font-semibold text-gray-900">Información de Registro</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-green-700 font-medium">Fecha de registro</p>
              <p className="text-sm text-green-900">
                {viewModel.formatDateTime(propuesta.getCreatedAt())}
              </p>
            </div>
            {propuesta.getUpdatedAt() && propuesta.getUpdatedAt()?.getTime() !== propuesta.getCreatedAt()?.getTime() && (
              <div className="bg-yellow-50 p-3 rounded-lg">
                <p className="text-sm text-yellow-700 font-medium">Última actualización</p>
                <p className="text-sm text-yellow-900">
                  {viewModel.formatDateTime(propuesta.getUpdatedAt()!)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ID único */}
        <div className="border-t pt-4">
          <p className="text-xs text-gray-500">
            <span className="font-medium">ID de Propuesta:</span> {propuesta.getId()}
          </p>
        </div>
      </div>

      {/* Footer del modal */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  );
});

export default PropuestaDetailModal;