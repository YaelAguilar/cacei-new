// src/features/alumnos-propuestas/presentation/pages/GenerarPropuesta.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import MainContainer from '../../../shared/layout/MainContainer';
import { Toasters } from '../../../shared/components/Toasters';
import { PropuestaViewModel } from '../viewModels/PropuestaViewModel';

// Componentes
import StepIndicator from '../components/StepIndicator';
import Step1AlumnoInfo from '../components/Step1AlumnoInfo';
import Step2ProyectoInfo from '../components/Step2ProyectoInfo';
import Step3EmpresaInfo from '../components/Step3EmpresaInfo';
import NoConvocatoriaMessage from '../components/NoConvocatoriaMessage';
import PropuestaExistenteMessage from '../components/PropuestaExistenteMessage';
import SuccessMessage from '../components/SuccessMessage';

// Estados de la vista
type ViewState = 'loading' | 'no-convocatoria' | 'propuesta-existente' | 'form' | 'success';

const GenerarPropuesta: React.FC = observer(() => {
  const navigate = useNavigate();
  
  // Crear instancia del ViewModel
  const propuestaViewModel = useMemo(() => new PropuestaViewModel(), []);
  
  // Estado local para controlar qué vista mostrar
  const [viewState, setViewState] = useState<ViewState>('loading');

  // Inicializar datos al montar el componente
  useEffect(() => {
    const initializeData = async () => {
      try {
        await propuestaViewModel.initialize();
        determineViewState();
      } catch (error) {
        console.error("Error al inicializar GenerarPropuesta:", error);
        Toasters("error", "Error al cargar los datos. Por favor, intenta nuevamente.");
      }
    };

    initializeData();

    // Cleanup al desmontar
    return () => {
      propuestaViewModel.reset();
    };
  }, [propuestaViewModel]);

  // Determinar qué vista mostrar basado en el estado del ViewModel
  const determineViewState = () => {
    if (!propuestaViewModel.isInitialized) {
      setViewState('loading');
      return;
    }

    if (!propuestaViewModel.hasConvocatoriaActiva) {
      setViewState('no-convocatoria');
      return;
    }

    if (propuestaViewModel.hasPropuestaEnConvocatoriaActual) {
      setViewState('propuesta-existente');
      return;
    }

    if (propuestaViewModel.lastCreatedPropuesta) {
      setViewState('success');
      return;
    }

    setViewState('form');
  };

  // Re-evaluar el estado cuando cambie el ViewModel
  useEffect(() => {
    if (propuestaViewModel.isInitialized) {
      determineViewState();
    }
  }, [
    propuestaViewModel.isInitialized,
    propuestaViewModel.hasConvocatoriaActiva,
    propuestaViewModel.hasPropuestaEnConvocatoriaActual,
    propuestaViewModel.lastCreatedPropuesta
  ]);

  // Manejar navegación entre steps
  const handleNextStep = () => {
    propuestaViewModel.nextStep();
  };

  const handlePreviousStep = () => {
    propuestaViewModel.previousStep();
  };

  const handleStepClick = (step: number) => {
    propuestaViewModel.goToStep(step);
  };

  // Determinar si se puede navegar a un step específico
  const canNavigateToStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return true; // Siempre se puede ir al step 1
      case 2:
        return propuestaViewModel.isStep1Valid;
      case 3:
        return propuestaViewModel.isStep1Valid && propuestaViewModel.isStep2Valid;
      default:
        return false;
    }
  };

  // Manejar envío del formulario
  const handleSubmitPropuesta = async () => {
    const success = await propuestaViewModel.createPropuesta();
    
    if (success) {
      Toasters("success", "¡Propuesta registrada exitosamente!");
      setViewState('success');
    } else {
      Toasters("error", propuestaViewModel.error || "Error al registrar la propuesta");
    }
  };

  // Manejar refresh de convocatoria
  const handleRefreshConvocatoria = async () => {
    await propuestaViewModel.loadConvocatoriaActiva();
    determineViewState();
  };

  // Navegar a mis propuestas
  const handleGoToMisPropuestas = () => {
    navigate('/mis-propuestas/visualizar-propuestas');
  };

  // Preparar nueva propuesta
  const handleNewPropuesta = () => {
    propuestaViewModel.resetForm();
    setViewState('form');
  };

  // Títulos de los steps
  const stepTitles = [
    'Información del Alumno',
    'Información del Proyecto', 
    'Información de la Empresa'
  ];

  // Renderizar contenido según el estado
  const renderContent = () => {
    switch (viewState) {
      case 'loading':
        return (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando información de convocatorias...</p>
            </div>
          </div>
        );

      case 'no-convocatoria':
        return (
          <NoConvocatoriaMessage 
            onRefresh={handleRefreshConvocatoria}
            loading={propuestaViewModel.loadingConvocatoria}
          />
        );

      case 'propuesta-existente':
        return (
          <PropuestaExistenteMessage 
            viewModel={propuestaViewModel}
            onViewPropuestas={handleGoToMisPropuestas}
          />
        );

      case 'success':
        return (
          <SuccessMessage 
            viewModel={propuestaViewModel}
            onNewPropuesta={handleNewPropuesta}
            onViewPropuestas={handleGoToMisPropuestas}
          />
        );

      case 'form':
      default:
        return (
          <div className="space-y-6">
            {/* Indicador de steps */}
            <StepIndicator
              currentStep={propuestaViewModel.currentStep}
              totalSteps={3}
              stepTitles={stepTitles}
              onStepClick={handleStepClick}
              canNavigateToStep={canNavigateToStep}
            />

            {/* Mostrar error si existe */}
            {propuestaViewModel.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{propuestaViewModel.error}</p>
                    <button
                      onClick={() => propuestaViewModel.clearError()}
                      className="mt-2 text-sm text-red-600 underline hover:no-underline"
                    >
                      Descartar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Steps del formulario */}
            {propuestaViewModel.currentStep === 1 && (
              <Step1AlumnoInfo
                viewModel={propuestaViewModel}
                onNext={handleNextStep}
              />
            )}

            {propuestaViewModel.currentStep === 2 && (
              <Step2ProyectoInfo
                viewModel={propuestaViewModel}
                onNext={handleNextStep}
                onPrevious={handlePreviousStep}
              />
            )}

            {propuestaViewModel.currentStep === 3 && (
              <Step3EmpresaInfo
                viewModel={propuestaViewModel}
                onSubmit={handleSubmitPropuesta}
                onPrevious={handlePreviousStep}
              />
            )}
          </div>
        );
    }
  };

  return (
    <MainContainer>
      <div className="mt-5">
        <div className="poppins">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-[23px] md:text-[36px] font-semibold text-black">
            </h1>
            <p className="text-[14px] md:text-[24px] font-light text-black">
              {viewState === 'form' 
                ? 'Completa los 3 pasos para registrar tu propuesta de proyecto.'
                : 'Gestión de propuestas de proyectos de pasantías.'
              }
            </p>
          </div>

          {/* Contenido principal */}
          {renderContent()}
        </div>
      </div>
    </MainContainer>
  );
});

export default GenerarPropuesta;