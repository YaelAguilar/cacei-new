import React from "react";
import { observer } from "mobx-react-lite";
import { ConvocatoriaViewModel } from "../viewModels/ConvocatoriaViewModel";

interface ProfesoresListProps {
  viewModel: ConvocatoriaViewModel;
}

const ProfesoresList: React.FC<ProfesoresListProps> = observer(({ viewModel }) => {
  return (
    <div className="mt-6">
      <h3 className="text-[18px] md:text-[22px] font-semibold text-black mb-3">
        Tutores académicos que participan en la convocatoria:
        {viewModel.loadingProfesores && (
          <span className="text-sm font-normal text-gray-500 ml-2">Cargando...</span>
        )}
      </h3>
      
      <div className="bg-gray-100 p-4 rounded-md max-h-40 overflow-y-auto">
        {viewModel.loadingProfesores ? (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
            <span className="ml-2 text-gray-600">Cargando profesores...</span>
          </div>
        ) : viewModel.profesores.length > 0 ? (
          viewModel.profesores.map((profesor) => (
            <p key={profesor.getId()} className="text-gray-800 text-sm mb-1">
              {profesor.getNombre()} - {profesor.getEmail()}
            </p>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No hay profesores disponibles en este momento.</p>
        )}
      </div>
      
      {!viewModel.loadingProfesores && viewModel.profesores.length > 0 && (
        <p className="text-xs text-gray-500 mt-2">
          Esta lista se guardará automáticamente con la convocatoria como registro histórico.
        </p>
      )}
    </div>
  );
});

export default ProfesoresList;