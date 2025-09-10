// src/features/alumnos-propuestas/presentation/components/PropuestaExistenteMessage.tsx
import React from 'react';
import { observer } from 'mobx-react-lite';
import { PropuestaViewModel } from '../viewModels/PropuestaViewModel';
import { FiCheckCircle, FiEye } from 'react-icons/fi';

interface PropuestaExistenteMessageProps {
  viewModel: PropuestaViewModel;
  onViewPropuestas: () => void;
}

const PropuestaExistenteMessage: React.FC<PropuestaExistenteMessageProps> = observer(({ 
  viewModel, 
  onViewPropuestas 
}) => {
  // Encontrar la propuesta de la convocatoria actual
  const propuestaActual = viewModel.misPropuestas.find(propuesta => 
    propuesta.getIdConvocatoria().toString() === viewModel.convocatoriaActiva?.getId()
  );

  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center max-w-lg mx-auto">
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
            <FiCheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Ya tienes una propuesta registrada
          </h2>
          <p className="text-gray-600 mb-6">
            Ya has enviado una propuesta para la convocatoria actual:{" "}
            <span className="font-semibold text-blue-600">
              {viewModel.convocatoriaActiva?.getNombre()}
            </span>
          </p>
        </div>

        {/* Información de la propuesta actual */}
        {propuestaActual && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-4 text-center">
              Tu Propuesta Actual
            </h3>
            
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Proyecto:</p>
                  <p className="font-medium text-gray-900">
                    {propuestaActual.getProyecto().getNombre()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tipo de Pasantía:</p>
                  <p className="font-medium text-gray-900">
                    {propuestaActual.getTipoPasantia()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Empresa:</p>
                  <p className="font-medium text-gray-900">
                    {propuestaActual.getEmpresa().getNombre()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tutor Académico:</p>
                  <p className="font-medium text-gray-900">
                    {propuestaActual.getTutorAcademico().getNombre()}
                  </p>
                </div>
              </div>
              
              <div className="pt-2 border-t border-gray-100">
                <p className="text-sm text-gray-500">Fecha de Registro:</p>
                <p className="font-medium text-gray-900">
                  {propuestaActual.getCreatedAt().toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">Información importante</h3>
          <ul className="text-sm text-blue-800 space-y-1 text-left">
            <li>• Solo puedes tener una propuesta por convocatoria</li>
            <li>• Puedes revisar tu propuesta en cualquier momento</li>
            <li>• Para modificaciones, contacta a tu coordinador</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onViewPropuestas}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <FiEye className="w-4 h-4" />
            Ver Mis Propuestas
          </button>
        </div>
      </div>
    </div>
  );
});

export default PropuestaExistenteMessage;