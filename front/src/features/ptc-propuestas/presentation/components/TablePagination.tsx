// src/features/ptc-propuestas/presentation/components/TablePagination.tsx
import React from "react";
import { observer } from "mobx-react-lite";
import { PTCPropuestasViewModel } from "../viewModels/PTCPropuestasViewModel";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface TablePaginationProps {
  viewModel: PTCPropuestasViewModel;
}

const TablePagination: React.FC<TablePaginationProps> = observer(({ viewModel }) => {
  const paginationInfo = viewModel.paginationInfo;

  if (paginationInfo.totalItems === 0) {
    return null;
  }

  const generatePageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    const { currentPage, totalPages } = paginationInfo;

    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
      {/* Información de elementos */}
      <div className="flex-1 flex justify-between sm:hidden">
        <button
          onClick={() => viewModel.setCurrentPage(paginationInfo.currentPage - 1)}
          disabled={!paginationInfo.hasPrevPage}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Anterior
        </button>
        <button
          onClick={() => viewModel.setCurrentPage(paginationInfo.currentPage + 1)}
          disabled={!paginationInfo.hasNextPage}
          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Siguiente
        </button>
      </div>

      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-700">
            Mostrando{" "}
            <span className="font-medium">{paginationInfo.startItem}</span> a{" "}
            <span className="font-medium">{paginationInfo.endItem}</span> de{" "}
            <span className="font-medium">{paginationInfo.totalItems}</span> resultados
          </p>

          {/* Selector de elementos por página */}
          <div className="flex items-center gap-2">
            <label htmlFor="itemsPerPage" className="text-sm text-gray-700">
              Por página:
            </label>
            <select
              id="itemsPerPage"
              value={viewModel.itemsPerPage}
              onChange={(e) => viewModel.setItemsPerPage(Number(e.target.value))}
              className="border border-gray-300 rounded-md text-sm py-1 px-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>

        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            {/* Botón Anterior */}
            <button
              onClick={() => viewModel.setCurrentPage(paginationInfo.currentPage - 1)}
              disabled={!paginationInfo.hasPrevPage}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Anterior</span>
              <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>

            {/* Números de página */}
            {pageNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => viewModel.setCurrentPage(pageNumber)}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                  pageNumber === paginationInfo.currentPage
                    ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                    : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                }`}
              >
                {pageNumber}
              </button>
            ))}

            {/* Puntos suspensivos si hay más páginas */}
            {paginationInfo.totalPages > pageNumbers[pageNumbers.length - 1] && (
              <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                ...
              </span>
            )}

            {/* Última página si no está en el rango visible */}
            {paginationInfo.totalPages > pageNumbers[pageNumbers.length - 1] && (
              <button
                onClick={() => viewModel.setCurrentPage(paginationInfo.totalPages)}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                {paginationInfo.totalPages}
              </button>
            )}

            {/* Botón Siguiente */}
            <button
              onClick={() => viewModel.setCurrentPage(paginationInfo.currentPage + 1)}
              disabled={!paginationInfo.hasNextPage}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Siguiente</span>
              <FiChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
});

export default TablePagination;