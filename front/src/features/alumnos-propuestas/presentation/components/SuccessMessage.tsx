// src/features/alumnos-propuestas/presentation/components/SuccessMessage.tsx
import React from 'react';
import { observer } from 'mobx-react-lite';
import { PropuestaViewModel } from '../viewModels/PropuestaViewModel';
import { FiCheckCircle, FiEye, FiPlus } from 'react-icons/fi';

interface SuccessMessageProps {
  viewModel: PropuestaViewModel;
  onNewPropuesta: () => void;
  onViewPropuestas: () => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> = observer(({ 
  viewModel, 
  onNewPropuesta, 
  onViewPropuestas 
}) => {
  const propuesta = viewModel.lastCreatedPropuesta;

  if (!propuesta) {
    return null;
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center max-w-2xl mx-auto">
        {/* Success Icon */}
        <div className="mb-6">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
            <FiCheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Propuesta Registrada Exitosamente!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Tu propuesta de proyecto ha sido enviada correctamente para revisión.
          </p>
        </div>

        {/* Propuesta Details Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 text-left shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            Resumen de tu Propuesta
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Proyecto:</p>
                <p className="text-gray-900 font-medium">
                  {propuesta.getProyecto().getNombre()}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Empresa:</p>
                <p className="text-gray-900 font-medium">
                  {propuesta.getEmpresa().getNombre()}
                </p>
                <p className="text-sm text-gray-600">
                  {propuesta.getEmpresa().getSector()}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Tutor Académico:</p>
                <p className="text-gray-900 font-medium">
                  {propuesta.getTutorAcademico().getNombre()}
                </p>
                <p className="text-sm text-gray-600">
                  {propuesta.getTutorAcademico().getEmail()}
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Tipo de Pasantía:</p>
                <p className="text-gray-900 font-medium">
                  {propuesta.getTipoPasantia()}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Período:</p>
                <p className="text-gray-900 font-medium">
                  {propuesta.getProyecto().getFechaInicio().toLocaleDateString('es-ES')} - {' '}
                  {propuesta.getProyecto().getFechaFin().toLocaleDateString('es-ES')}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Fecha de Registro:</p>
                <p className="text-gray-900 font-medium">
                  {propuesta.getCreatedAt().toLocaleDateString('es-ES', {
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
          
          {/* ID de la propuesta */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-sm font-medium text-gray-500 mb-1">ID de Propuesta:</p>
            <p className="text-gray-900 font-mono bg-gray-50 px-3 py-1 rounded inline-block">
              {propuesta.getId()}
            </p>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-blue-900 mb-3">Próximos Pasos</h3>
          <ul className="text-sm text-blue-800 space-y-2 text-left">
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-200 text-blue-800 text-xs font-bold mr-3 mt-0.5 flex-shrink-0">1</span>
              Tu propuesta será revisada por el comité académico
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-200 text-blue-800 text-xs font-bold mr-3 mt-0.5 flex-shrink-0">2</span>
              Recibirás notificación del estatus de tu propuesta
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-200 text-blue-800 text-xs font-bold mr-3 mt-0.5 flex-shrink-0">3</span>
              Mantente atento a tu correo electrónico institucional
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onViewPropuestas}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <FiEye className="w-4 h-4" />
            Ver Todas Mis Propuestas
          </button>
          
          {/* Solo mostrar si puede crear otra propuesta */}
          {viewModel.canCreatePropuesta && (
            <button
              onClick={onNewPropuesta}
              className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              Nueva Propuesta
            </button>
          )}
        </div>

        {/* Contact Information */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            ¿Tienes dudas? Contacta a tu coordinador académico o al departamento de pasantías.
          </p>
        </div>
      </div>
    </div>
  );
});

export default SuccessMessage;