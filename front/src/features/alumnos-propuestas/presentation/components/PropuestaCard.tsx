// src/features/alumnos-propuestas/presentation/components/PropuestaCard.tsx
import React from "react";
import { observer } from "mobx-react-lite";
import { FiBriefcase, FiEye, FiUser, FiCalendar, FiFileText, FiEdit, FiCheck, FiX, FiRefreshCw } from "react-icons/fi";
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
              {propuesta.getProyecto()?.getNombre() || 'Proyecto sin nombre'}
            </h3>
            
            {/* Información del proyecto */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <FiCalendar className="w-4 h-4" />
              <span>
                {viewModel.formatDate(propuesta.getProyecto().getFechaInicio())} - {' '}
                {viewModel.formatDate(propuesta.getProyecto().getFechaFin())}
              </span>
            </div>

            {/* NUEVA INFORMACIÓN: Estudiante */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FiUser className="w-4 h-4 text-blue-500" />
              <span className="font-medium text-blue-700">
                {propuesta.getEstudiante().getNombreCompleto()}
              </span>
            </div>
          </div>
          
          {/* Status badge */}
          <div className="flex-shrink-0">
            <Status 
              active={statusInfo.activa}
              label={statusInfo.estatus.label}
              className={`${statusInfo.fondoPrincipal} ${statusInfo.colorPrincipal}`}
            />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        {/* Empresa */}
        <div className="flex items-start gap-3">
          <FiBriefcase className="w-5 h-5 text-purple-500 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-700">Empresa</p>
            <p className="text-sm text-gray-900 truncate">
              {propuesta.getEmpresa().getNombreCorto() || propuesta.getEmpresa().getRazonSocial()}
            </p>
            <p className="text-xs text-gray-500">{propuesta.getEmpresa().getSector()}</p>
          </div>
        </div>

        {/* Tutor Académico */}
        <div className="flex items-start gap-3">
          <FiUser className="w-5 h-5 text-green-500 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-700">Tutor Académico</p>
            <p className="text-sm text-gray-900 truncate">
              {propuesta.getTutorAcademico().getNombre()}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {propuesta.getTutorAcademico().getEmail()}
            </p>
          </div>
        </div>

        {/* Tipo de Pasantía */}
        <div className="flex items-start gap-3">
          <FiFileText className="w-5 h-5 text-orange-500 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-700">Tipo de Pasantía</p>
            <p className="text-sm text-gray-900">{propuesta.getTipoPasantia()}</p>
          </div>
        </div>
      </div>

      {/* Footer con acciones */}
      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <div className="flex flex-col space-y-3">
          {/* Botón principal de ver detalles */}
          <button
            onClick={() => viewModel.openDetailModal(propuesta)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiEye className="w-4 h-4" />
            Ver Detalles Completos
          </button>

          {/* Acciones de estatus (solo si showStatusActions es true) */}
          {showStatusActions && statusInfo.activa && (
            <div className="flex gap-2">
              {statusInfo.estatus.status !== 'aprobado' && (
                <button
                  onClick={() => handleStatusChange('APROBADO')}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                  title="Aprobar propuesta"
                >
                  <FiCheck className="w-4 h-4" />
                  Aprobar
                </button>
              )}
              
              {statusInfo.estatus.status !== 'rechazado' && (
                <button
                  onClick={() => handleStatusChange('RECHAZADO')}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                  title="Rechazar propuesta"
                >
                  <FiX className="w-4 h-4" />
                  Rechazar
                </button>
              )}
              
              {statusInfo.estatus.status !== 'actualizar' && (
                <button
                  onClick={() => handleStatusChange('ACTUALIZAR')}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 transition-colors"
                  title="Solicitar actualización"
                >
                  <FiRefreshCw className="w-4 h-4" />
                  Actualizar
                </button>
              )}
              
              {statusInfo.estatus.status !== 'pendiente' && (
                <button
                  onClick={() => handleStatusChange('PENDIENTE')}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
                  title="Volver a pendiente"
                >
                  <FiEdit className="w-4 h-4" />
                  Pendiente
                </button>
              )}
            </div>
          )}
        </div>

        {/* Fecha de registro */}
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Registrado el {viewModel.formatDateTime(propuesta.getCreatedAt())}
          </p>
        </div>
      </div>
    </div>
  );
});

export default PropuestaCard;