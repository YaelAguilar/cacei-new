import React from "react";

export type ButtonVariant = 
  | "primary"     // Botón principal (azul)
  | "secondary"    // Botón secundario (gris)
  | "success"      // Botón de éxito (verde)
  | "danger"       // Botón de peligro (rojo)
  | "warning"      // Botón de advertencia (amarillo)
  | "info"         // Botón de información (cian)
  | "outline"      // Botón con borde
  | "ghost"        // Botón transparente
  | "link";        // Botón como enlace

export type ButtonSize = "sm" | "md" | "lg";

type Props = {
  // Props básicas
  onClick?: () => void;
  label?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  
  // Props de estilo
  variant?: ButtonVariant;
  size?: ButtonSize;
  
  // Props de contenido
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  loading?: boolean;
  
  // Props de accesibilidad
  title?: string;
  "aria-label"?: string;
  
  // Props de layout
  fullWidth?: boolean;
  
  // Compatibilidad con versión anterior
  isAdd?: boolean; // Deprecated: usar variant="primary" en su lugar
};

const Button: React.FC<Props> = ({
  // Props básicas
  onClick,
  label = "",
  type = "button",
  disabled = false,
  className = "",
  
  // Props de estilo
  variant = "primary",
  size = "md",
  
  // Props de contenido
  icon,
  iconPosition = "left",
  loading = false,
  
  // Props de accesibilidad
  title,
  "aria-label": ariaLabel,
  
  // Props de layout
  fullWidth = false,
  
  // Compatibilidad con versión anterior
  isAdd, // Deprecated
}) => {
  // Determinar variant basado en isAdd para compatibilidad
  const finalVariant = isAdd !== undefined 
    ? (isAdd ? "primary" : "outline")
    : variant;

  // Estilos base
  const baseStyles = `
    inline-flex items-center justify-center gap-2 cursor-pointer poppins
    font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? "w-full" : ""}
  `;

  // Estilos de tamaño
  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs rounded-md",
    md: "px-4 py-2 text-sm rounded-lg",
    lg: "px-6 py-3 text-base rounded-lg"
  };

  // Estilos de variante
  const variantStyles = {
    primary: "bg-[#498FD0] text-white hover:bg-[#498fd0af] focus:ring-blue-500",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    warning: "bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500",
    info: "bg-cyan-600 text-white hover:bg-cyan-700 focus:ring-cyan-500",
    outline: "border border-gray-400 text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
    link: "text-blue-600 hover:text-blue-800 underline focus:ring-blue-500"
  };

  const isDisabled = disabled || loading;

  return (
    <button
      onClick={onClick}
      type={type}
      disabled={isDisabled}
      title={title}
      aria-label={ariaLabel}
      className={`
        ${baseStyles}
        ${sizeStyles[size]}
        ${variantStyles[finalVariant]}
        ${className}
      `.trim()}
    >
      {loading && (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
      )}
      
      {!loading && icon && iconPosition === "left" && (
        <span className="flex-shrink-0">{icon}</span>
      )}
      
      {label && <span>{label}</span>}
      
      {!loading && icon && iconPosition === "right" && (
        <span className="flex-shrink-0">{icon}</span>
      )}
    </button>
  );
};


export default Button;
