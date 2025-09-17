// src/features/ptc-propuestas/presentation/components/PropuestasTable.tsx
import React from "react";
import { observer } from "mobx-react-lite";
import { PTCPropuestasViewModel } from "../viewModels/PTCPropuestasViewModel";
import { FiEye, FiChevronUp, FiChevronDown, FiBriefcase, FiUser, FiCalendar } from "react-icons/fi";
import Status from "../../../shared/components/Status";

interface PropuestasTableProps {
  viewModel: PTCPropuestasViewModel;
}

const PropuestasTable: React.FC<PropuestasTableProps> = observer(({ viewModel }) => {
  const handleSort = (column: string) => {
    viewModel.setSortColumn(column);
  };

  const getSortIcon = (column: string) => {
    if (viewModel.sortColumn === column) {
      return viewModel.sortDirection === "asc" ? 
        <FiChevronUp className="w-4 h-4" /> : 
        <FiChevronDown className="w-4 h-4" />;
    }
    return null;
  };

  const getSortableHeaderClass = (column: string) => {
    return `px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors ${
      viewModel.sortColumn === column ? 'bg-gray-100' : ''
    }`;
  };

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                onClick={() => handleSort("proyecto")}
                className={getSortableHeaderClass("proyecto")}
              >
                <div className="flex items-center justify-between">
                  <span>Proyecto</span>
                  {getSortIcon("proyecto")}
                </div>
              </th>
              <th
                onClick={() => handleSort("empresa")}
                className={getSortableHeaderClass("empresa")}
              >
                <div className="flex items-center justify-between">
                  <span>Empresa</span>
                  {getSortIcon("empresa")}
                </div>
              </th>
              <th
                onClick={() => handleSort("tutor")}
                className={getSortableHeaderClass("tutor")}
              >
                <div className="flex items-center justify-between">
                  <span>Tutor Académico</span>
                  {getSortIcon("tutor")}
                </div>
              </th>
              <th
                onClick={() => handleSort("tipoPasantia")}
                className={getSortableHeaderClass("tipoPasantia")}
              >
                <div className="flex items-center justify-between">
                  <span>Tipo</span>
                  {getSortIcon("tipoPasantia")}
                </div>
              </th>
              <th
                onClick={() => handleSort("fechaInicio")}
                className={getSortableHeaderClass("fechaInicio")}
              >
                <div className="flex items-center justify-between">
                  <span>Fecha Inicio</span>
                  {getSortIcon("fechaInicio")}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {viewModel.paginatedPropuestas.map((propuesta) => {
              const statusInfo = viewModel.getPropuestaStatus(propuesta);
              
              return (
                <tr key={propuesta.getId()} className="hover:bg-gray-50 transition-colors">
                  {/* Proyecto */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <FiBriefcase className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                          {propuesta.getProyecto().getNombre()}
                        </div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {propuesta.getProyecto().getDescripcion()}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Empresa */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {propuesta.getEmpresa().getNombre()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {propuesta.getEmpresa().getSector()}
                    </div>
                  </td>

                  {/* Tutor Académico */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                          <FiUser className="h-4 w-4 text-indigo-600" />
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {propuesta.getTutorAcademico().getNombre()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {propuesta.getTutorAcademico().getEmail()}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Tipo de Pasantía */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {propuesta.getTipoPasantia()}
                    </span>
                  </td>

                  {/* Fecha de Inicio */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <FiCalendar className="h-4 w-4 mr-2 text-gray-400" />
                      {viewModel.formatDate(propuesta.getProyecto().getFechaInicio())}
                    </div>
                  </td>

                  {/* Estado */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Status 
                      active={statusInfo.status === 'active'}
                      label={statusInfo.label}
                      className={statusInfo.color}
                    />
                  </td>

                  {/* Acciones */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => viewModel.openDetailModal(propuesta)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      <FiEye className="h-4 w-4 mr-1" />
                      Ver detalles
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Estado vacío */}
      {viewModel.filteredPropuestas.length === 0 && !viewModel.loading && (
        <div className="text-center py-12">
          <FiBriefcase className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay propuestas</h3>
          <p className="mt-1 text-sm text-gray-500">
            {viewModel.searchTerm || viewModel.statusFilter !== "all" || viewModel.tipoPasantiaFilter !== "all"
              ? "No se encontraron propuestas que coincidan con los filtros aplicados."
              : "No hay propuestas registradas en el sistema."
            }
          </p>
          {(viewModel.searchTerm || viewModel.statusFilter !== "all" || viewModel.tipoPasantiaFilter !== "all") && (
            <div className="mt-4">
              <button
                onClick={() => viewModel.clearFilters()}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export default PropuestasTable;