import React from 'react';
import { observer } from 'mobx-react-lite';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
  onStepClick?: (step: number) => void;
  canNavigateToStep?: (step: number) => boolean;
}

const StepIndicator: React.FC<StepIndicatorProps> = observer(({
  currentStep,
  totalSteps,
  stepTitles,
  onStepClick,
  canNavigateToStep
}) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full mb-8">
      {/* Barra de progreso */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Steps */}
      <div className="flex justify-between items-center">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          const canNavigate = canNavigateToStep ? canNavigateToStep(stepNumber) : true;

          return (
            <div key={stepNumber} className="flex flex-col items-center flex-1">
              <button
                onClick={() => canNavigate && onStepClick?.(stepNumber)}
                disabled={!canNavigate}
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
                  transition-all duration-200 mb-2
                  ${isActive 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : isCompleted
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }
                  ${canNavigate ? 'cursor-pointer hover:shadow-md' : 'cursor-not-allowed'}
                `}
              >
                {isCompleted ? '✓' : stepNumber}
              </button>
              
              <span className={`
                text-xs text-center px-2
                ${isActive ? 'text-blue-600 font-semibold' : 'text-gray-500'}
              `}>
                {stepTitles[index] || `Step ${stepNumber}`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default StepIndicator;