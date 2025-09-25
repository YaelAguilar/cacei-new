// src/features/alumnos-propuestas/presentation/components/PropuestaCard.tsx
import React from "react";
import { observer } from "mobx-react-lite";
import { FiBriefcase, FiEye, FiUser, FiCalendar, FiFileText } from "react-icons/fi";
import { PropuestaCompleta } from "../../data/models/Propuesta";
import { VisualizarPropuestasViewModel } from "../viewModels/VisualizarPropuestasViewModel";
import Status from "../../../shared/components/Status";

interface PropuestaCardProps {
  propuesta: PropuestaCompleta;
  viewModel: VisualizarPropuestasViewModel;
  showStatusActions?: boolean; // Nuevo prop para mostrar acciones de estatus
}

const PropuestaCard: React.FC<PropuestaCardProps> = observer(({ 
  propuesta, 
  viewModel,
  showStatusActions = false 
}) => {
  const statusInfo = viewModel.getPropuestaDetailedStatus(propuesta);

  const handleStatusChange = async (newStatus: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO' | 'ACTUALIZAR') => {
    const success = await viewModel.updateProposalStatus(propuesta.getId(), newStatus);
    if (!success && viewModel.error) {
      console.error("Error al actualizar estatus:", viewModel.error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between mb-3 gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 break-words">
              {propuesta.getProyecto().getNombre()}
            </h3>
            
            {/* Información del proyecto */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <FiCalendar className="w-4 h-4" />
              <span>
                {viewModel.formatDate(propuesta.getProyecto().getFechaInicio())} - {' '}
                {viewModel.formatDate(propuesta.getProyecto().getFechaFin())}
              </span>
            </div>
          </div>
          
          <div className="flex-shrink-0 flex flex-col items-end gap-2">
            {/* Estado activo/inactivo */}
            <Status 
              active={propuesta.isActive()}
              label={propuesta.isActive() ? 'Activa' : 'Inactiva'}
              className={propuesta.isActive() ? 'text-green-600 bg-green-100 border-green-300' : 'text-gray-600 bg-gray-100 border-gray-300'}
            />
            
            {/* Estatus de la propuesta (solo si está activa) */}
            {statusInfo.mostrarEstatus && (
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${statusInfo.estatus.bgColor} ${statusInfo.estatus.color}`}>
                {statusInfo.estatus.label}
              </div>
            )}
          </div>
        </div>

        {/* Tipo de Pasantía */}
        <div>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {propuesta.getTipoPasantia()}
          </span>
        </div>
      </div>

      {/* Detalles principales */}
      <div className="p-4 space-y-3">
        {/* Empresa */}
        <div className="flex items-center gap-2 min-w-0">
          <FiBriefcase className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-xs text-gray-500">Empresa</p>
            <p className="text-sm font-medium text-gray-900 truncate">
              {propuesta.getEmpresa().getNombreCorto() || propuesta.getEmpresa().getRazonSocial()}
            </p>
          </div>
        </div>

        {/* Tutor Académico */}
        <div className="flex items-center gap-2 min-w-0">
          <FiUser className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-xs text-gray-500">Tutor Académico</p>
            <p className="text-sm font-medium text-gray-900 truncate">
              {propuesta.getTutorAcademico().getNombre()}
            </p>
          </div>
        </div>

        {/* Supervisor */}
        <div className="flex items-center gap-2 min-w-0">
          <FiFileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-xs text-gray-500">Supervisor</p>
            <p className="text-sm font-medium text-gray-900 truncate">
              {propuesta.getSupervisor().getNombre()}
            </p>
          </div>
        </div>

        {/* Fechas de registro */}
        <div className="pt-3 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            <p>
              <span className="font-medium">Registrado:</span>{" "}
              {viewModel.formatDateTime(propuesta.getCreatedAt())}
            </p>
            {propuesta.getUpdatedAt() && propuesta.getUpdatedAt()?.getTime() !== propuesta.getCreatedAt()?.getTime() && (
              <p className="mt-0.5">
                <span className="font-medium">Actualizado:</span>{" "}
                {viewModel.formatDateTime(propuesta.getUpdatedAt()!)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Acciones de estatus (solo para tutores/administradores) */}
      {showStatusActions && propuesta.isActive() && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
          <div className="text-xs text-gray-600 mb-2">Cambiar estatus:</div>
          <div className="flex flex-wrap gap-1">
            {propuesta.getEstatus() !== 'APROBADO' && (
              <button
                onClick={() => handleStatusChange('APROBADO')}
                className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Aprobar
              </button>
            )}
            {propuesta.getEstatus() !== 'RECHAZADO' && (
              <button
                onClick={() => handleStatusChange('RECHAZADO')}
                className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Rechazar
              </button>
            )}
            {propuesta.getEstatus() !== 'ACTUALIZAR' && (
              <button
                onClick={() => handleStatusChange('ACTUALIZAR')}
                className="px-2 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
              >
                Solicitar Actualización
              </button>
            )}
            {propuesta.getEstatus() !== 'PENDIENTE' && (
              <button
                onClick={() => handleStatusChange('PENDIENTE')}
                className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Pendiente
              </button>
            )}
          </div>
        </div>
      )}

      {/* Footer con botón de acción principal */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
        <button
          onClick={() => viewModel.openDetailModal(propuesta)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          <FiEye className="w-4 h-4" />
          Ver detalles completos
        </button>
      </div>
    </div>
  );
});

export default PropuestaCard;