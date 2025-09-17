// src/features/ptc-propuestas/presentation/components/TableFilters.tsx
import React from "react";
import { observer } from "mobx-react-lite";
import { PTCPropuestasViewModel } from "../viewModels/PTCPropuestasViewModel";
import { FiSearch, FiFilter, FiX } from "react-icons/fi";

interface TableFiltersProps {
  viewModel: PTCPropuestasViewModel;
}

const TableFilters: React.FC<TableFiltersProps> = observer(({ viewModel }) => {
  const hasActiveFilters = viewModel.searchTerm || 
                          viewModel.statusFilter !== "all" || 
                          viewModel.tipoPasantiaFilter !== "all";

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        
        {/* Búsqueda */}
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={viewModel.searchTerm}
              onChange={(e) => viewModel.setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Buscar por proyecto, empresa, tutor o tipo de pasantía..."
            />
          </div>
        </div>

        {/* Filtro por Estado */}
        <div className="w-full lg:w-48">
          <select
            value={viewModel.statusFilter}
            onChange={(e) => viewModel.setStatusFilter(e.target.value as "all" | "active" | "inactive")}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activas</option>
            <option value="inactive">Inactivas</option>
          </select>
        </div>

        {/* Filtro por Tipo de Pasantía */}
        <div className="w-full lg:w-48">
          <select
            value={viewModel.tipoPasantiaFilter}
            onChange={(e) => viewModel.setTipoPasantiaFilter(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="all">Todos los tipos</option>
            {viewModel.uniqueTiposPasantia.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
        </div>

        {/* Botón limpiar filtros */}
        {hasActiveFilters && (
          <div className="flex items-center">
            <button
              onClick={() => viewModel.clearFilters()}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              title="Limpiar filtros"
            >
              <FiX className="h-4 w-4 mr-1" />
              Limpiar
            </button>
          </div>
        )}
      </div>

      {/* Indicador de filtros activos */}
      {hasActiveFilters && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <div className="flex items-center text-sm text-gray-600">
            <FiFilter className="h-4 w-4 mr-1" />
            Filtros activos:
          </div>
          
          {viewModel.searchTerm && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Búsqueda: "{viewModel.searchTerm}"
            </span>
          )}
          
          {viewModel.statusFilter !== "all" && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Estado: {viewModel.statusFilter === "active" ? "Activas" : "Inactivas"}
            </span>
          )}
          
          {viewModel.tipoPasantiaFilter !== "all" && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              Tipo: {viewModel.tipoPasantiaFilter}
            </span>
          )}
        </div>
      )}
    </div>
  );
});

export default TableFilters;