import React from "react";

export type LoadingSize = "sm" | "md" | "lg" | "xl";
export type LoadingVariant = "spinner" | "dots" | "pulse";

type Props = {
  size?: LoadingSize;
  variant?: LoadingVariant;
  text?: string;
  className?: string;
  fullScreen?: boolean;
};

const Loading: React.FC<Props> = ({
  size = "md",
  variant = "spinner",
  text,
  className = "",
  fullScreen = false,
}) => {
  // Estilos de tamaño
  const sizeStyles = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16"
  };

  // Estilos de texto
  const textSizeStyles = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg"
  };

  // Componente spinner
  const Spinner = () => (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeStyles[size]}`} />
  );

  // Componente dots
  const Dots = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`bg-blue-600 rounded-full animate-pulse ${sizeStyles[size].replace('h-', 'h-').replace('w-', 'w-')}`}
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1s'
          }}
        />
      ))}
    </div>
  );

  // Componente pulse
  const Pulse = () => (
    <div className={`bg-blue-600 rounded-full animate-pulse ${sizeStyles[size]}`} />
  );

  // Renderizar el componente de loading apropiado
  const renderLoadingComponent = () => {
    switch (variant) {
      case "dots":
        return <Dots />;
      case "pulse":
        return <Pulse />;
      default:
        return <Spinner />;
    }
  };

  // Contenido del loading
  const loadingContent = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      {renderLoadingComponent()}
      {text && (
        <p className={`text-gray-600 font-medium ${textSizeStyles[size]}`}>
          {text}
        </p>
      )}
    </div>
  );

  // Si es fullScreen, envolver en un overlay
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        {loadingContent}
      </div>
    );
  }

  return loadingContent;
};

export default Loading;
