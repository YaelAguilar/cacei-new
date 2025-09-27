// src/features/ptc-propuestas/presentation/pages/VisualizarPropuestas.tsx
import React, { useEffect, useMemo } from "react";
import { observer } from "mobx-react-lite";
import MainContainer from "../../../shared/layout/MainContainer";
import { PTCPropuestasViewModel } from "../viewModels/PTCPropuestasViewModel";
import StatisticsCards from "../components/StatisticsCards";
import TableFilters from "../components/TableFilters";
import PropuestasTable from "../components/PropuestasTable";
import TablePagination from "../components/TablePagination";
// Modal eliminado - ahora se usa navegación a página de detalles
import { FiRefreshCw, FiAlertCircle, FiDownload } from "react-icons/fi";

const VisualizarPropuestas: React.FC = observer(() => {
  // Crear instancia del ViewModel usando useMemo para evitar recreaciones
  const ptcViewModel = useMemo(() => new PTCPropuestasViewModel(), []);

  // Inicializar datos al montar el componente
  useEffect(() => {
    const initializeData = async () => {
      try {
        await ptcViewModel.initialize();
      } catch (error) {
        console.error("Error al inicializar VisualizarPropuestas PTC:", error);
      }
    };

    initializeData();

    // Cleanup al desmontar
    return () => {
      ptcViewModel.reset();
    };
  }, [ptcViewModel]);

  // Manejar actualización manual
  const handleRefresh = async () => {
    await ptcViewModel.loadPropuestas();
  };

  // Mostrar loading mientras se inicializa
  if (!ptcViewModel.isInitialized) {
    return (
      <MainContainer>
        <div className="mt-5">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando propuestas de proyectos...</p>
            </div>
          </div>
        </div>
      </MainContainer>
    );
  }

  return (
    <MainContainer>
      <div className="mt-5">
        <div className="poppins">
          {/* Header - Manteniendo la misma estructura que Dashboard */}
          <h1 className="text-[23px] md:text-[36px] font-semibold text-black">
            Propuestas de Proyectos
          </h1>
          <p className="text-[14px] md:text-[24px] font-light text-black">
            Gestión y revisión de todas las propuestas de proyectos registradas por los estudiantes.
          </p>

          {/* Botones de acción */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-3 mt-4 mb-6">
            <button
              onClick={handleRefresh}
              disabled={ptcViewModel.loading}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FiRefreshCw className={`w-4 h-4 ${ptcViewModel.loading ? 'animate-spin' : ''}`} />
              {ptcViewModel.loading ? 'Actualizando...' : 'Actualizar'}
            </button>
            
            {/* Botón de exportar (futuro) */}
            <button
              onClick={() => {
                // TODO: Implementar exportación
                alert('Funcionalidad de exportación próximamente');
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              title="Exportar datos"
            >
              <FiDownload className="w-4 h-4" />
              Exportar
            </button>
          </div>

          {/* Grid principal con el mismo espaciado que Dashboard */}
          <div className="grid grid-cols-1 gap-6 md:gap-8 mt-10 my-14">
            
            {/* Estadísticas rápidas */}
            {ptcViewModel.hasPropuestas && (
              <div className="col-span-1">
                <StatisticsCards viewModel={ptcViewModel} />
              </div>
            )}

            {/* Manejo de errores */}
            {ptcViewModel.error && (
              <div className="col-span-1">
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <FiAlertCircle className="h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm">
                        <strong>Error:</strong> {ptcViewModel.error}
                      </p>
                      <button
                        onClick={() => ptcViewModel.clearError()}
                        className="mt-2 text-sm underline hover:no-underline"
                      >
                        Descartar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Filtros de búsqueda */}
            {ptcViewModel.hasPropuestas && (
              <div className="col-span-1">
                <TableFilters viewModel={ptcViewModel} />
              </div>
            )}

            {/* Loading state */}
            {ptcViewModel.loading && (
              <div className="col-span-1">
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              </div>
            )}

            {/* Contenido principal */}
            {!ptcViewModel.loading && (
              <div className="col-span-1">
                {ptcViewModel.hasPropuestas ? (
                  <div className="space-y-6">
                    {/* Tabla */}
                    <PropuestasTable viewModel={ptcViewModel} />
                    
                    {/* Paginación */}
                    <TablePagination viewModel={ptcViewModel} />
                  </div>
                ) : (
                  /* Estado vacío */
                  <div className="text-center py-12">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                      <FiAlertCircle className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No hay propuestas registradas
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Aún no se han registrado propuestas de proyectos en el sistema. 
                      Las propuestas aparecerán aquí cuando los estudiantes las registren.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        onClick={handleRefresh}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Verificar nuevamente
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Grid adicional con información para tutores - Manteniendo estructura de Dashboard */}
          <div className="grid gap-5">
            {ptcViewModel.hasPropuestas && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Información para Tutores Académicos</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Puede ver todas las propuestas registradas por los estudiantes</li>
                  <li>• Use los filtros para encontrar propuestas específicas</li>
                  <li>• Haga clic en "Ver detalles" para revisar la información completa de cada propuesta</li>
                  <li>• Las propuestas se muestran organizadas por fecha de registro</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Modal eliminado - ahora se usa navegación a página de detalles */}
      </div>
    </MainContainer>
  );
});

export default VisualizarPropuestas;