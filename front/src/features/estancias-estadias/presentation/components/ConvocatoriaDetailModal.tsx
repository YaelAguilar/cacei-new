import React from "react";
import { observer } from "mobx-react-lite";
import { Convocatoria } from "../../data/models/Convocatoria";
import { VisualizarConvocatoriasViewModel } from "../viewModels/VisualizarConvocatoriasViewModel";
import Modal from "../../../shared/layout/Modal";
import Status from "../../../shared/components/Status";
import { FiCalendar, FiUsers, FiFileText, FiClock, FiTag } from "react-icons/fi";

interface ConvocatoriaDetailModalProps {
  convocatoria: Convocatoria;
  viewModel: VisualizarConvocatoriasViewModel;
  onClose: () => void;
}

const ConvocatoriaDetailModal: React.FC<ConvocatoriaDetailModalProps> = observer(({ 
  convocatoria, 
  viewModel, 
  onClose 
}) => {
  const statusInfo = viewModel.getConvocatoriaStatus(convocatoria);
  const daysRemaining = viewModel.getDaysRemaining(convocatoria);

  return (
    <Modal
      title={convocatoria.getNombre()}
      subtitle="Detalles completos de la convocatoria"
      onClose={onClose}
    >
      <div className="mt-6 max-h-96 overflow-y-auto space-y-6">
        {/* Estado y días restantes */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <Status 
            active={statusInfo.status === 'active'}
            label={statusInfo.label}
            className={statusInfo.color}
          />
          {statusInfo.status === 'active' && daysRemaining !== null && (
            <div className="text-right">
              <p className="text-sm text-gray-500">Tiempo restante</p>
              <p className="font-semibold text-blue-600">
                {daysRemaining > 0 
                  ? `${daysRemaining} día${daysRemaining !== 1 ? 's' : ''}`
                  : 'Vence hoy'
                }
              </p>
            </div>
          )}
        </div>

        {/* Descripción */}
        {convocatoria.getDescripcion() && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FiFileText className="w-5 h-5 text-gray-500" />
              <h4 className="font-semibold text-gray-900">Descripción</h4>
            </div>
            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
              {convocatoria.getDescripcion()}
            </p>
          </div>
        )}

        {/* Fecha límite */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FiCalendar className="w-5 h-5 text-gray-500" />
            <h4 className="font-semibold text-gray-900">Fecha límite</h4>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="font-medium text-blue-900">
              {viewModel.formatDate(convocatoria.getFechaLimite())}
            </p>
          </div>
        </div>

        {/* Pasantías disponibles */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FiTag className="w-5 h-5 text-gray-500" />
            <h4 className="font-semibold text-gray-900">
              Pasantías disponibles ({convocatoria.getPasantiasDisponibles().length})
            </h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {convocatoria.getPasantiasDisponibles().map((pasantia, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
              >
                {pasantia}
              </span>
            ))}
          </div>
        </div>

        {/* Tutores académicos */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FiUsers className="w-5 h-5 text-gray-500" />
            <h4 className="font-semibold text-gray-900">
              Tutores académicos ({convocatoria.getProfesoresDisponibles().length})
            </h4>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 max-h-32 overflow-y-auto">
            {convocatoria.getProfesoresDisponibles().length > 0 ? (
              <div className="space-y-2">
                {convocatoria.getProfesoresDisponibles().map((profesor) => (
                  <div key={profesor.getId()} className="flex items-center justify-between py-1">
                    <span className="text-sm font-medium text-gray-900">
                      {profesor.getNombre()}
                    </span>
                    <span className="text-xs text-gray-500">
                      {profesor.getEmail()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">
                No hay tutores asignados
              </p>
            )}
          </div>
        </div>

        {/* Información de timestamps */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FiClock className="w-5 h-5 text-gray-500" />
            <h4 className="font-semibold text-gray-900">Información de creación</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-green-700 font-medium">Fecha de creación</p>
              <p className="text-sm text-green-900">
                {viewModel.formatDate(convocatoria.getCreatedAt())}
              </p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <p className="text-sm text-yellow-700 font-medium">Última actualización</p>
              <p className="text-sm text-yellow-900">
                {viewModel.formatDate(convocatoria.getUpdatedAt())}
              </p>
            </div>
          </div>
        </div>

        {/* ID único */}
        <div className="border-t pt-4">
          <p className="text-xs text-gray-500">
            <span className="font-medium">ID:</span> {convocatoria.getId()}
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

export default ConvocatoriaDetailModal;