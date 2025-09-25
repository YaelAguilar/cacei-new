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