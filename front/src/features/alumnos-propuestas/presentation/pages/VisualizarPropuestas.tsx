// src/features/alumnos-propuestas/presentation/pages/VisualizarPropuestas.tsx
import React, { useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import MainContainer from "../../../shared/layout/MainContainer";
import Button from "../../../shared/components/Button";
import { VisualizarPropuestasViewModel } from "../viewModels/VisualizarPropuestasViewModel";
import PropuestaCard from "../components/PropuestaCard";
// Modal eliminado - ahora se usa navegación a página de detalles
import { FiRefreshCw, FiAlertCircle, FiFileText, FiPlus, FiFilter } from "react-icons/fi";
import { ProposalStatus } from "../../data/models/Propuesta";
import { useAuth } from "../../../../core/utils/AuthContext";

const VisualizarPropuestas: React.FC = observer(() => {
  // Crear instancia del ViewModel usando useMemo para evitar recreaciones
  const visualizarViewModel = useMemo(() => new VisualizarPropuestasViewModel(), []);
  const authViewModel = useAuth();
  
  // Estado local para filtros
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<ProposalStatus | 'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [showFilters, setShowFilters] = useState(false);

  // Verificar si el usuario puede gestionar estatus (es tutor/admin)
  const canManageStatus = authViewModel.userRoles.some(role => 
    ['PTC', 'PA', 'Director', 'Admin'].includes(role.name)
  );

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
    if (selectedStatusFilter && selectedStatusFilter !== 'ALL' && selectedStatusFilter !== 'ACTIVE' && selectedStatusFilter !== 'INACTIVE') {
      await visualizarViewModel.loadPropuestasByStatus(selectedStatusFilter as ProposalStatus);
    } else {
      await visualizarViewModel.loadPropuestas();
    }
  };

  // Manejar cambio de filtro
  const handleFilterChange = async (filter: ProposalStatus | 'ALL' | 'ACTIVE' | 'INACTIVE') => {
    setSelectedStatusFilter(filter);
    
    if (filter === 'ALL') {
      await visualizarViewModel.loadPropuestas();
    } else if (filter === 'ACTIVE' || filter === 'INACTIVE') {
      await visualizarViewModel.loadPropuestas(); // Cargar todas y filtrar en UI
    } else {
      await visualizarViewModel.loadPropuestasByStatus(filter as ProposalStatus);
    }
  };

  // Filtrar propuestas según el filtro seleccionado
  const getFilteredPropuestas = () => {
    switch (selectedStatusFilter) {
      case 'ACTIVE':
        return visualizarViewModel.propuestasActivas;
      case 'INACTIVE':
        return visualizarViewModel.propuestasInactivas;
      case 'PENDIENTE':
        return visualizarViewModel.propuestasPendientes;
      case 'APROBADO':
        return visualizarViewModel.propuestasAprobadas;
      case 'RECHAZADO':
        return visualizarViewModel.propuestasRechazadas;
      case 'ACTUALIZAR':
        return visualizarViewModel.propuestasParaActualizar;
      case 'ALL':
      default:
        return visualizarViewModel.propuestas;
    }
  };

  const filteredPropuestas = getFilteredPropuestas();

  // Opciones de filtro
  const filterOptions = [
    { value: 'ALL', label: 'Todas', count: visualizarViewModel.statistics.total },
    { value: 'ACTIVE', label: 'Activas', count: visualizarViewModel.statistics.activas },
    { value: 'INACTIVE', label: 'Inactivas', count: visualizarViewModel.statistics.inactivas },
    ...(canManageStatus ? [
      { value: 'PENDIENTE', label: 'Pendientes', count: visualizarViewModel.statistics.pendientes },
      { value: 'APROBADO', label: 'Aprobadas', count: visualizarViewModel.statistics.aprobadas },
      { value: 'RECHAZADO', label: 'Rechazadas', count: visualizarViewModel.statistics.rechazadas },
      { value: 'ACTUALIZAR', label: 'Para Actualizar', count: visualizarViewModel.statistics.paraActualizar }
    ] : [])
  ];

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
                {canManageStatus ? 'Gestión de Propuestas' : 'Mis Propuestas'}
              </h1>
              <p className="text-[14px] md:text-[24px] font-light text-black">
                {canManageStatus 
                  ? 'Visualiza y gestiona todas las propuestas de proyectos.'
                  : 'Visualiza todas tus propuestas de proyectos registradas.'
                }
              </p>
            </div>
            
            {/* Botones de acción */}
            <div className="mt-4 md:mt-0 flex gap-3">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="secondary"
                size="sm"
                icon={<FiFilter className="w-4 h-4" />}
                label="Filtros"
              />
              
              <Button
                onClick={handleRefresh}
                disabled={visualizarViewModel.loading}
                loading={visualizarViewModel.loading}
                variant="secondary"
                size="sm"
                icon={<FiRefreshCw className="w-4 h-4" />}
                label={visualizarViewModel.loading ? 'Actualizando...' : 'Actualizar'}
              />
              
              {!canManageStatus && (
                <Button
                  onClick={() => window.location.href = '/mis-propuestas/nueva-propuesta'}
                  variant="primary"
                  size="sm"
                  icon={<FiPlus className="w-4 h-4" />}
                  label="Nueva Propuesta"
                />
              )}
            </div>
          </div>

          {/* Panel de filtros */}
          {showFilters && (
            <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Filtrar propuestas</h3>
              <div className="flex flex-wrap gap-2">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleFilterChange(option.value as any)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                      selectedStatusFilter === option.value
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {option.label} ({option.count})
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Estadísticas rápidas */}
          {visualizarViewModel.hasPropuestas && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FiFileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-xl font-semibold text-gray-900">
                      {visualizarViewModel.statistics.total}
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
                      {visualizarViewModel.statistics.activas}
                    </p>
                  </div>
                </div>
              </div>

              {canManageStatus && (
                <>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <FiFileText className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Pendientes</p>
                        <p className="text-xl font-semibold text-gray-900">
                          {visualizarViewModel.statistics.pendientes}
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
                        <p className="text-sm text-gray-500">Aprobadas</p>
                        <p className="text-xl font-semibold text-gray-900">
                          {visualizarViewModel.statistics.aprobadas}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <FiFileText className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Rechazadas</p>
                        <p className="text-xl font-semibold text-gray-900">
                          {visualizarViewModel.statistics.rechazadas}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <FiFileText className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">P/Actualizar</p>
                        <p className="text-xl font-semibold text-gray-900">
                          {visualizarViewModel.statistics.paraActualizar}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
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

          {/* Información del filtro actual */}
          {selectedStatusFilter !== 'ALL' && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Filtro activo:</strong> {filterOptions.find(f => f.value === selectedStatusFilter)?.label} 
                ({filteredPropuestas.length} propuesta{filteredPropuestas.length !== 1 ? 's' : ''})
              </p>
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
              {filteredPropuestas.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPropuestas.map((propuesta) => (
                    <PropuestaCard
                      key={propuesta.getId()}
                      propuesta={propuesta}
                      viewModel={visualizarViewModel}
                      showStatusActions={canManageStatus}
                    />
                  ))}
                </div>
              ) : (
                /* Estado vacío */
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <FiFileText className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {selectedStatusFilter === 'ALL' 
                      ? 'No tienes propuestas registradas'
                      : `No hay propuestas ${filterOptions.find(f => f.value === selectedStatusFilter)?.label?.toLowerCase()}`
                    }
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {selectedStatusFilter === 'ALL' 
                      ? 'Aún no has registrado ninguna propuesta de proyecto. Cuando haya una convocatoria activa, podrás registrar tu primera propuesta.'
                      : `No se encontraron propuestas con el filtro seleccionado.`
                    }
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {selectedStatusFilter !== 'ALL' && (
                      <Button
                        onClick={() => handleFilterChange('ALL')}
                        variant="secondary"
                        size="sm"
                        label="Ver todas las propuestas"
                      />
                    )}
                    <Button
                      onClick={handleRefresh}
                      variant="primary"
                      size="sm"
                      label="Actualizar lista"
                    />
                    {!canManageStatus && selectedStatusFilter === 'ALL' && (
                      <Button
                        onClick={() => window.location.href = '/mis-propuestas/nueva-propuesta'}
                        variant="success"
                        size="sm"
                        label="Verificar convocatorias"
                      />
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal eliminado - ahora se usa navegación a página de detalles */}
      </div>
    </MainContainer>
  );
});

export default VisualizarPropuestas;