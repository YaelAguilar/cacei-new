// src/features/alumnos-propuestas/presentation/pages/VisualizarPropuestas.tsx
import React, { useEffect, useMemo } from "react";
import { observer } from "mobx-react-lite";
import MainContainer from "../../../shared/layout/MainContainer";
import { VisualizarPropuestasViewModel } from "../viewModels/VisualizarPropuestasViewModel";
import PropuestaCard from "../components/PropuestaCard";
import PropuestaDetailModal from "../../../shared/components/PropuestaDetailModal";
import { FiRefreshCw, FiAlertCircle, FiFileText, FiPlus } from "react-icons/fi";

const VisualizarPropuestas: React.FC = observer(() => {
  // Crear instancia del ViewModel usando useMemo para evitar recreaciones
  const visualizarViewModel = useMemo(() => new VisualizarPropuestasViewModel(), []);

  // Inicializar datos al montar el componente
  useEffect(() => {
    const initializeData = async () => {
      try {
        await visualizarViewModel.initialize();
      } catch (error) {
        console.error("Error al inicializar VisualizarPropuestas:", error);
      }
    };

    initializeData();

    // Cleanup al desmontar
    return () => {
      visualizarViewModel.reset();
    };
  }, [visualizarViewModel]);

  // Manejar actualización manual
  const handleRefresh = async () => {
    await visualizarViewModel.loadPropuestas();
  };

  // Mostrar loading mientras se inicializa
  if (!visualizarViewModel.isInitialized) {
    return (
      <MainContainer>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-gray-600">Cargando tus propuestas...</span>
        </div>
      </MainContainer>
    );
  }

  return (
    <MainContainer>
      <div className="mt-5">
        <div className="poppins">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-[23px] md:text-[36px] font-semibold text-black">
                Mis Propuestas
              </h1>
              <p className="text-[14px] md:text-[24px] font-light text-black">
                Visualiza todas tus propuestas de proyectos registradas.
              </p>
            </div>
            
            {/* Botones de acción */}
            <div className="mt-4 md:mt-0 flex gap-3">
              <button
                onClick={handleRefresh}
                disabled={visualizarViewModel.loading}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FiRefreshCw className={`w-4 h-4 ${visualizarViewModel.loading ? 'animate-spin' : ''}`} />
                {visualizarViewModel.loading ? 'Actualizando...' : 'Actualizar'}
              </button>
              
              <button
                onClick={() => window.location.href = '/mis-propuestas/nueva-propuesta'}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiPlus className="w-4 h-4" />
                Nueva Propuesta
              </button>
            </div>
          </div>

          {/* Estadísticas rápidas */}
          {visualizarViewModel.hasPropuestas && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FiFileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-xl font-semibold text-gray-900">
                      {visualizarViewModel.propuestas.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <FiFileText className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Activas</p>
                    <p className="text-xl font-semibold text-gray-900">
                      {visualizarViewModel.propuestasActivas.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FiFileText className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Inactivas</p>
                    <p className="text-xl font-semibold text-gray-900">
                      {visualizarViewModel.propuestasInactivas.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Manejo de errores */}
          {visualizarViewModel.error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FiAlertCircle className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <p className="text-sm">
                    <strong>Error:</strong> {visualizarViewModel.error}
                  </p>
                  <button
                    onClick={() => visualizarViewModel.clearError()}
                    className="mt-2 text-sm underline hover:no-underline"
                  >
                    Descartar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Loading state */}
          {visualizarViewModel.loading && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          )}

          {/* Lista de propuestas */}
          {!visualizarViewModel.loading && (
            <>
              {visualizarViewModel.hasPropuestas ? (
                <div className="space-y-8">
                  {/* Propuestas activas */}
                  {visualizarViewModel.propuestasActivas.length > 0 && (
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        Propuestas Activas ({visualizarViewModel.propuestasActivas.length})
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {visualizarViewModel.propuestasActivas.map((propuesta) => (
                          <PropuestaCard
                            key={propuesta.getId()}
                            propuesta={propuesta}
                            viewModel={visualizarViewModel}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Propuestas inactivas */}
                  {visualizarViewModel.propuestasInactivas.length > 0 && (
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                        Propuestas Inactivas ({visualizarViewModel.propuestasInactivas.length})
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {visualizarViewModel.propuestasInactivas.map((propuesta) => (
                          <PropuestaCard
                            key={propuesta.getId()}
                            propuesta={propuesta}
                            viewModel={visualizarViewModel}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Estado vacío */
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <FiFileText className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No tienes propuestas registradas
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Aún no has registrado ninguna propuesta de proyecto. Cuando haya una convocatoria activa, podrás registrar tu primera propuesta.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={handleRefresh}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Actualizar lista
                    </button>
                    <button
                      onClick={() => window.location.href = '/mis-propuestas/nueva-propuesta'}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Verificar convocatorias
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal de detalles */}
        {visualizarViewModel.showDetailModal && visualizarViewModel.selectedPropuesta && (
          <PropuestaDetailModal
            propuesta={visualizarViewModel.selectedPropuesta}
            viewModel={visualizarViewModel}
            onClose={() => visualizarViewModel.closeDetailModal()}
          />
        )}
      </div>
    </MainContainer>
  );
});

export default VisualizarPropuestas;