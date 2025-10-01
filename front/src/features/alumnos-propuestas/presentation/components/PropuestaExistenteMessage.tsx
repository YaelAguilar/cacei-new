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
  // Usar la propuesta bloqueante del ViewModel
  const propuestaActual = viewModel.propuestaBloqueante;
  
  // Determinar el tipo de mensaje basado en el estado
  const estado = propuestaActual?.getEstatus();
  const esAprobada = estado === 'APROBADO';
  const necesitaActualizar = estado === 'ACTUALIZAR';
  const estaPendiente = estado === 'PENDIENTE';

  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center max-w-lg mx-auto">
        <div className="mb-6">
          <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
            esAprobada ? 'bg-green-100' : 
            necesitaActualizar ? 'bg-yellow-100' : 
            'bg-blue-100'
          }`}>
            <FiCheckCircle className={`w-10 h-10 ${
              esAprobada ? 'text-green-600' : 
              necesitaActualizar ? 'text-yellow-600' : 
              'text-blue-600'
            }`} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {esAprobada ? 'Propuesta Aprobada' : 
             necesitaActualizar ? 'Propuesta Requiere Actualización' :
             'Propuesta en Evaluación'}
          </h2>
          <p className="text-gray-600 mb-6">
            {esAprobada 
              ? `Tu propuesta ha sido aprobada para la convocatoria: `
              : necesitaActualizar
              ? `Tu propuesta requiere actualizaciones para la convocatoria: `
              : `Tu propuesta está siendo evaluada para la convocatoria: `
            }
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
                    {propuestaActual.getProyecto()?.getNombre() || 'Proyecto sin nombre'}
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
                    {propuestaActual.getEmpresa().getNombreCorto() || propuestaActual.getEmpresa().getRazonSocial()}
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

        <div className={`border rounded-lg p-4 mb-6 ${
          esAprobada 
            ? 'bg-green-50 border-green-200' 
            : necesitaActualizar
            ? 'bg-yellow-50 border-yellow-200'
            : 'bg-blue-50 border-blue-200'
        }`}>
          <h3 className={`font-semibold mb-2 ${
            esAprobada ? 'text-green-900' : 
            necesitaActualizar ? 'text-yellow-900' :
            'text-blue-900'
          }`}>
            {esAprobada ? '¡Felicitaciones!' : 
             necesitaActualizar ? 'Acción Requerida' :
             'Evaluación en Proceso'}
          </h3>
          <ul className={`text-sm space-y-1 text-left ${
            esAprobada ? 'text-green-800' : 
            necesitaActualizar ? 'text-yellow-800' :
            'text-blue-800'
          }`}>
            {esAprobada ? (
              <>
                <li>• Tu propuesta ha sido aprobada exitosamente</li>
                <li>• No puedes crear una nueva propuesta en esta convocatoria</li>
                <li>• Puedes revisar los detalles de tu propuesta aprobada</li>
                <li>• Contacta a tu coordinador si necesitas información adicional</li>
              </>
            ) : necesitaActualizar ? (
              <>
                <li>• Tu propuesta necesita ser actualizada según los comentarios</li>
                <li>• No puedes crear una nueva propuesta hasta resolver las observaciones</li>
                <li>• Revisa los comentarios y actualiza tu propuesta existente</li>
                <li>• Contacta a tu tutor académico si tienes dudas</li>
              </>
            ) : (
              <>
                <li>• Tu propuesta está siendo evaluada por los tutores académicos</li>
                <li>• No puedes crear una nueva propuesta mientras está en evaluación</li>
                <li>• Puedes revisar el progreso de la evaluación</li>
                <li>• Contacta a tu tutor académico si tienes preguntas</li>
              </>
            )}
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onViewPropuestas}
            className={`flex items-center justify-center gap-2 px-6 py-3 text-white rounded-lg font-medium transition-colors ${
              esAprobada 
                ? 'bg-green-600 hover:bg-green-700' 
                : necesitaActualizar
                ? 'bg-yellow-600 hover:bg-yellow-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            <FiEye className="w-4 h-4" />
            {esAprobada ? 'Ver Propuesta Aprobada' : 
             necesitaActualizar ? 'Revisar Propuesta' :
             'Ver Estado de Evaluación'}
          </button>
        </div>
      </div>
    </div>
  );
});

export default PropuestaExistenteMessage;