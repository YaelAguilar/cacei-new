// src/features/alumnos-propuestas/presentation/components/NoConvocatoriaMessage.tsx
import React from 'react';
import { observer } from 'mobx-react-lite';
import { FiRefreshCw, FiCalendar } from 'react-icons/fi';

interface NoConvocatoriaMessageProps {
  onRefresh: () => void;
  loading: boolean;
}

const NoConvocatoriaMessage: React.FC<NoConvocatoriaMessageProps> = observer(({ 
  onRefresh, 
  loading 
}) => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-yellow-100 flex items-center justify-center">
            <FiCalendar className="w-10 h-10 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No hay convocatoria activa
          </h2>
          <p className="text-gray-600 mb-6">
            Actualmente no hay ninguna convocatoria abierta para recibir propuestas de proyectos de pasantías.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">¿Qué puedes hacer?</h3>
          <ul className="text-sm text-blue-800 space-y-1 text-left">
            <li>• Contacta a tu coordinador académico</li>
            <li>• Revisa los anuncios oficiales</li>
            <li>• Mantente atento a futuras convocatorias</li>
          </ul>
        </div>

        <button
          onClick={onRefresh}
          disabled={loading}
          className={`
            flex items-center justify-center gap-2 px-6 py-3 
            bg-blue-600 text-white rounded-lg font-medium
            transition-all duration-200
            ${loading 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-blue-700 active:transform active:scale-95'
            }
          `}
        >
          <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Verificando...' : 'Verificar nuevamente'}
        </button>
      </div>
    </div>
  );
});

export default NoConvocatoriaMessage;