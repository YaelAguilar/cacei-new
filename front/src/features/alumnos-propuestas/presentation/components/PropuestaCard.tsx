// src/features/alumnos-propuestas/presentation/components/PropuestaCard.tsx
import React from "react";
import { observer } from "mobx-react-lite";
import { FiBriefcase, FiEye } from "react-icons/fi";

import { Propuesta } from "../../data/models/Propuesta";
import { VisualizarPropuestasViewModel } from "../viewModels/VisualizarPropuestasViewModel";
import Status from "../../../shared/components/Status";

interface PropuestaCardProps {
  propuesta: Propuesta;
  viewModel: VisualizarPropuestasViewModel;
}

const PropuestaCard: React.FC<PropuestaCardProps> = observer(({ 
  propuesta, 
  viewModel 
}) => {
  const statusInfo = viewModel.getPropuestaStatus(propuesta);

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between mb-3 gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 break-words">
              {propuesta.getProyecto().getNombre()}
            </h3>
          </div>
          <div className="flex-shrink-0">
            <Status 
              active={statusInfo.status === 'active'}
              label={statusInfo.label}
              className={statusInfo.color}
            />
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
              {propuesta.getEmpresa().getNombre()}
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

      {/* Footer con botón de acción */}
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