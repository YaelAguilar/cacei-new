import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { CarViewModel } from "../viewModels/CarViewModel";
import Modal from "../../../shared/layout/Modal";
import CarForm from "../components/CarForm";
import { AiOutlineEdit, AiOutlineDelete, AiOutlinePlus } from "react-icons/ai";
import MainContainer from "../../../shared/layout/MainContainer";

/**
 * Vista principal para gestión de carros con modal para crear/editar
 */
const CarViewWithModal: React.FC = observer(() => {
  // Creamos una instancia del ViewModel
  const viewModel = React.useMemo(() => new CarViewModel(), []);

  // Cargamos datos al montar el componente
  useEffect(() => {
    viewModel.loadCars();
  }, [viewModel]);

  return (
    <MainContainer>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestión de Carros</h1>
          <button
            onClick={() => viewModel.prepareForCreate()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <AiOutlinePlus className="mr-2" />
            Nuevo Carro
          </button>
        </div>

        {/* Mostrar mensajes de error */}
        {viewModel.error && !viewModel.isModalOpen && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
            role="alert"
          >
            <p>{viewModel.error}</p>
          </div>
        )}

        {/* Indicador de carga */}
        {viewModel.loading && (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Tabla de carros */}
        {!viewModel.loading && viewModel.cars.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No hay carros registrados.</p>
            <button
              onClick={() => viewModel.prepareForCreate()}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Agregar un carro
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Marca
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Modelo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Año
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Color
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Placa
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {viewModel.cars.map((car) => (
                  <tr key={car.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {car.make}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {car.model}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {car.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {car.color || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {car.licensePlate || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => viewModel.selectCarForEdit(car)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <AiOutlineEdit size={20} />
                      </button>
                      <button
                        onClick={() => viewModel.confirmDelete(car.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <AiOutlineDelete size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal para crear/editar carro */}
        {viewModel.isModalOpen && (
          <Modal
            title={viewModel.modalTitle}
            subtitle={viewModel.modalSubtitle}
            onClose={() => viewModel.closeModal()}
          >
            <CarForm viewModel={viewModel} />
          </Modal>
        )}
      </div>
    </MainContainer>
  );
});

export default CarViewWithModal;
