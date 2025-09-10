import React, { useEffect, useMemo } from "react";
import { observer } from "mobx-react-lite";
import MainContainer from "../../../shared/layout/MainContainer";
import { Toasters } from "../../../shared/components/Toasters";
import { ConvocatoriaViewModel } from "../viewModels/ConvocatoriaViewModel";
import ConvocatoriaForm from "../components/ConvocatoriaForm";
import ProfesoresList from "../components/ProfesoresList";
import AlertBanner from "../components/AlertBanner";

const NuevoPeriodo: React.FC = observer(() => {
  // Crear instancia del ViewModel usando useMemo para evitar recreaciones
  const convocatoriaViewModel = useMemo(() => new ConvocatoriaViewModel(), []);

  // Inicializar datos al montar el componente
  useEffect(() => {
    const initializeData = async () => {
      try {
        await convocatoriaViewModel.initialize();
      } catch (error) {
        console.error("Error al inicializar NuevoPeriodo:", error);
      }
    };

    initializeData();

    // Cleanup al desmontar
    return () => {
      convocatoriaViewModel.reset();
    };
  }, [convocatoriaViewModel]); // Ahora incluimos la dependencia

  // Mostrar loading mientras se inicializa
  if (!convocatoriaViewModel.isInitialized) {
    return (
      <MainContainer>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-gray-600">Verificando convocatorias activas...</span>
        </div>
      </MainContainer>
    );
  }

  // Callback para cuando se crea exitosamente una convocatoria
  const handleCreateSuccess = () => {
    Toasters("success", "¡Convocatoria creada exitosamente!");
  };

  return (
    <MainContainer>
      <div className="mt-5">
        <div className="poppins">
          <h1 className="text-[23px] md:text-[36px] font-semibold text-black">
            Convocatorias
          </h1>
          <p className="text-[14px] md:text-[24px] font-light text-black mb-6">
            Crear una nueva convocatoria.
          </p>
        </div>

        {/* Alertas */}
        <AlertBanner viewModel={convocatoriaViewModel} />

        {/* Formulario de convocatoria */}
        <ConvocatoriaForm 
          viewModel={convocatoriaViewModel}
          onSuccess={handleCreateSuccess}
        />

        {/* Lista de profesores */}
        <ProfesoresList viewModel={convocatoriaViewModel} />
      </div>
    </MainContainer>
  );
});

export default NuevoPeriodo;