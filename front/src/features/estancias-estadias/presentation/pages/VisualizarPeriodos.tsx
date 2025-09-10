import React, { useEffect, useMemo } from "react";
import { observer } from "mobx-react-lite";
import MainContainer from "../../../shared/layout/MainContainer";
import { VisualizarConvocatoriasViewModel } from "../viewModels/VisualizarConvocatoriasViewModel";
import ConvocatoriaCard from "../components/ConvocatoriaCard";
import ConvocatoriaDetailModal from "../components/ConvocatoriaDetailModal";
import EditConvocatoriaModal from "../components/EditConvocatoriaModal";
import { Toasters } from "../../../shared/components/Toasters";
import { FiRefreshCw, FiAlertCircle, FiCalendar } from "react-icons/fi";

const VisualizarPeriodos: React.FC = observer(() => {
  // Crear instancia del ViewModel usando useMemo para evitar recreaciones
  const visualizarViewModel = useMemo(() => new VisualizarConvocatoriasViewModel(), []);

  // Inicializar datos al montar el componente
  useEffect(() => {
    const initializeData = async () => {
      try {
        await visualizarViewModel.initialize();
      } catch (error) {
        console.error("Error al inicializar VisualizarPeriodos:", error);
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
    await visualizarViewModel.loadConvocatorias();
  };

  // Callback para cuando se actualiza exitosamente una convocatoria
  const handleUpdateSuccess = () => {
    Toasters("success", "¡Convocatoria actualizada exitosamente!");
  };

  // Mostrar loading mientras se inicializa
  if (!visualizarViewModel.isInitialized) {
    return (
      <MainContainer>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-gray-600">Cargando convocatorias...</span>
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
                Convocatorias
              </h1>
              <p className="text-[14px] md:text-[24px] font-light text-black">
                Visualizar todas las convocatorias registradas.
              </p>
            </div>
            
            {/* Botón de actualizar */}
            <div className="mt-4 md:mt-0">
              <button
                onClick={handleRefresh}
                disabled={visualizarViewModel.loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FiRefreshCw className={`w-4 h-4 ${visualizarViewModel.loading ? 'animate-spin' : ''}`} />
                {visualizarViewModel.loading ? 'Actualizando...' : 'Actualizar'}
              </button>
            </div>
          </div>

          {/* Estadísticas rápidas */}
          {visualizarViewModel.hasConvocatorias && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FiCalendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-xl font-semibold text-gray-900">
                      {visualizarViewModel.convocatorias.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <FiCalendar className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Activas</p>
                    <p className="text-xl font-semibold text-gray-900">
                      {visualizarViewModel.convocatoriasActivas.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FiCalendar className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Inactivas</p>
                    <p className="text-xl font-semibold text-gray-900">
                      {visualizarViewModel.convocatoriasInactivas.length}
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

          {/* Lista de convocatorias */}
          {!visualizarViewModel.loading && (
            <>
              {visualizarViewModel.hasConvocatorias ? (
                <div className="space-y-8">
                  {/* Convocatorias activas */}
                  {visualizarViewModel.convocatoriasActivas.length > 0 && (
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        Convocatorias Activas ({visualizarViewModel.convocatoriasActivas.length})
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {visualizarViewModel.convocatoriasActivas.map((convocatoria) => (
                          <ConvocatoriaCard
                            key={convocatoria.getId()}
                            convocatoria={convocatoria}
                            viewModel={visualizarViewModel}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Convocatorias inactivas */}
                  {visualizarViewModel.convocatoriasInactivas.length > 0 && (
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                        Convocatorias Inactivas ({visualizarViewModel.convocatoriasInactivas.length})
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {visualizarViewModel.convocatoriasInactivas.map((convocatoria) => (
                          <ConvocatoriaCard
                            key={convocatoria.getId()}
                            convocatoria={convocatoria}
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
                    <FiCalendar className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No hay convocatorias
                  </h3>
                  <p className="text-gray-600 mb-4">
                    No se han encontrado convocatorias registradas en el sistema.
                  </p>
                  <button
                    onClick={handleRefresh}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Actualizar lista
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal de detalles */}
        {visualizarViewModel.showDetailModal && visualizarViewModel.selectedConvocatoria && (
          <ConvocatoriaDetailModal
            convocatoria={visualizarViewModel.selectedConvocatoria}
            viewModel={visualizarViewModel}
            onClose={() => visualizarViewModel.closeDetailModal()}
          />
        )}

        {/* Modal de edición */}
        {visualizarViewModel.showEditModal && visualizarViewModel.convocatoriaToEdit && (
          <EditConvocatoriaModal
            convocatoria={visualizarViewModel.convocatoriaToEdit}
            viewModel={visualizarViewModel}
            onClose={() => visualizarViewModel.closeEditModal()}
            onSuccess={handleUpdateSuccess}
          />
        )}
      </div>
    </MainContainer>
  );
});

export default VisualizarPeriodos;