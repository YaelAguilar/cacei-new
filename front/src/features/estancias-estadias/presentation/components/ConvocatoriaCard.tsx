import React from "react";
import { observer } from "mobx-react-lite";
import { Convocatoria } from "../../data/models/Convocatoria";
import { VisualizarConvocatoriasViewModel } from "../viewModels/VisualizarConvocatoriasViewModel";
import { FiCalendar, FiUsers, FiFileText, FiEye } from "react-icons/fi";
import Status from "../../../shared/components/Status";

interface ConvocatoriaCardProps {
  convocatoria: Convocatoria;
  viewModel: VisualizarConvocatoriasViewModel;
}

const ConvocatoriaCard: React.FC<ConvocatoriaCardProps> = observer(({ 
  convocatoria, 
  viewModel 
}) => {
  const statusInfo = viewModel.getConvocatoriaStatus(convocatoria);
  const daysRemaining = viewModel.getDaysRemaining(convocatoria);

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {convocatoria.getNombre()}
            </h3>
            {convocatoria.getDescripcion() && (
              <p className="text-gray-600 text-sm line-clamp-2">
                {convocatoria.getDescripcion()}
              </p>
            )}
          </div>
          <div className="ml-4">
            <Status 
              active={statusInfo.status === 'active'}
              label={statusInfo.label}
              className={statusInfo.color}
            />
          </div>
        </div>

        {/* Información adicional para convocatorias activas */}
        {statusInfo.status === 'active' && daysRemaining !== null && (
          <div className="mb-4">
            {daysRemaining > 0 ? (
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-blue-600 font-medium">
                  {daysRemaining} día{daysRemaining !== 1 ? 's' : ''} restante{daysRemaining !== 1 ? 's' : ''}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-600 font-medium">
                  Vence hoy
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Detalles */}
      <div className="p-6 space-y-4">
        {/* Fecha límite */}
        <div className="flex items-center gap-3">
          <FiCalendar className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-500">Fecha límite</p>
            <p className="text-sm font-medium text-gray-900">
              {viewModel.formatDate(convocatoria.getFechaLimite())}
            </p>
          </div>
        </div>

        {/* Pasantías disponibles */}
        <div className="flex items-start gap-3">
          <FiFileText className="w-5 h-5 text-gray-400 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-gray-500 mb-2">Pasantías disponibles</p>
            <div className="flex flex-wrap gap-1">
              {convocatoria.getPasantiasDisponibles().map((pasantia, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {pasantia}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Profesores */}
        <div className="flex items-center gap-3">
          <FiUsers className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-500">Tutores académicos</p>
            <p className="text-sm font-medium text-gray-900">
              {convocatoria.getProfesoresDisponibles().length} profesor{convocatoria.getProfesoresDisponibles().length !== 1 ? 'es' : ''}
            </p>
          </div>
        </div>

        {/* Fechas de creación y actualización */}
        <div className="pt-4 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
            <div>
              <p>Creado</p>
              <p className="font-medium">
                {new Intl.DateTimeFormat('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                }).format(convocatoria.getCreatedAt())}
              </p>
            </div>
            <div>
              <p>Actualizado</p>
              <p className="font-medium">
                {new Intl.DateTimeFormat('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                }).format(convocatoria.getUpdatedAt())}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer con botón de acción */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <button
          onClick={() => viewModel.openDetailModal(convocatoria)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          <FiEye className="w-4 h-4" />
          Ver detalles
        </button>
      </div>
    </div>
  );
});

export default ConvocatoriaCard;