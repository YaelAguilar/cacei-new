// src/core/navigation/LazyComponentWrapper.tsx
import React, { useState, useEffect } from 'react';
import { AutoDiscoveryRegistry } from './AutoDiscoveryRegistry';

interface LazyComponentWrapperProps {
  componentName: string;
  featureName?: string;
  [key: string]: any;
}

/**
 * Componente que maneja la carga lazy de componentes con auto-discovery
 */
export const LazyComponentWrapper: React.FC<LazyComponentWrapperProps> = ({ 
  componentName, 
  featureName, 
  ...props 
}) => {
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadComponent = async () => {
      try {
        const loadedComponent = await AutoDiscoveryRegistry.loadComponent(componentName, featureName);
        if (isMounted) {
          setComponent(() => loadedComponent);
          setLoading(false);
        }
      } catch (err: any) {
        console.error(`❌ LazyComponentWrapper failed for ${componentName}:`, err);
        if (isMounted) {
          setError(err.message);
          setLoading(false);
          // En caso de error, mostrar componente NotFound
          setComponent(() => NotFoundComponent);
        }
      }
    };

    loadComponent();

    return () => {
      isMounted = false;
    };
  }, [componentName, featureName]);

  // UI de loading
  if (loading) {
    return <LoadingComponent componentName={componentName} />;
  }

  if (error) {
    console.error(`Error en LazyComponentWrapper para ${componentName}:`, error);
  }

  return Component ? <Component {...props} /> : null;
};

/**
 * Componente de loading reutilizable
 */
const LoadingComponent: React.FC<{ componentName: string }> = ({ componentName }) => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto mb-4"></div>
        <div 
          className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full border-t-blue-400 animate-spin mx-auto" 
          style={{animationDelay: '0.3s'}}
        ></div>
      </div>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        Cargando {componentName}
      </h3>
      <p className="text-sm text-gray-500">
        Descubriendo componente...
      </p>
    </div>
  </div>
);

/**
 * Componente cuando no se encuentra el componente solicitado
 */
const NotFoundComponent: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center max-w-md mx-auto p-6">
      <div className="mb-6">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
          <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 18.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
      </div>
      
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Componente no encontrado
      </h1>
      
      <p className="text-gray-600 mb-4">
        El componente solicitado no existe o no sigue las convenciones de nomenclatura.
      </p>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 text-left">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Verificar:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Archivo existe en <code>features/[feature]/presentation/pages/</code></li>
          <li>• Usa <code>export default</code></li>
          <li>• Convención PascalCase</li>
        </ul>
      </div>
      
      <div className="flex gap-3 justify-center">
        <button 
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          ← Volver
        </button>
        <button 
          onClick={() => window.location.href = '/'}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          🏠 Inicio
        </button>
      </div>
    </div>
  </div>
);

/**
 * Hook personalizado para usar auto-discovery
 */
export const useLazyComponent = (componentName: string, featureName?: string) => {
  const [component, setComponent] = useState<React.ComponentType<any> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    AutoDiscoveryRegistry.loadComponent(componentName, featureName)
      .then(comp => {
        if (isMounted) {
          setComponent(() => comp);
          setLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [componentName, featureName]);

  return { component, loading, error };
};