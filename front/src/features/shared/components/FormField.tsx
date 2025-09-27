import React, { useState } from "react";
import { Field, ErrorMessage } from "formik";
import { FiEye, FiEyeOff, FiAlertCircle } from "react-icons/fi";

export type FieldType = "text" | "email" | "password" | "number" | "tel" | "url" | "textarea" | "select";

type Option = {
  value: string | number;
  label: string;
  disabled?: boolean;
};

type Props = {
  // Props básicas
  name: string;
  id?: string;
  label: string;
  type?: FieldType;
  placeholder?: string;
  
  // Props de contenido
  icon?: React.ReactNode;
  tooltip?: string;
  options?: Option[]; // Para select
  
  // Props de validación
  required?: boolean;
  
  // Props de estilo
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  
  // Props de layout
  fullWidth?: boolean;
  
  // Props de accesibilidad
  "aria-label"?: string;
  "aria-describedby"?: string;
};

const FormField: React.FC<Props> = ({
  name,
  id,
  label,
  type = "text",
  placeholder,
  icon,
  tooltip,
  options = [],
  required = false,
  className = "",
  labelClassName = "",
  inputClassName = "",
  fullWidth = true,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedby,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const fieldId = id || name;
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  // Estilos base
  const baseInputStyles = `
    w-full rounded-lg border border-gray-300 px-4 py-2 text-sm
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    transition-colors duration-200
    ${fullWidth ? "w-full" : ""}
    ${inputClassName}
  `;

  const baseLabelStyles = `
    block text-sm font-medium text-gray-700 mb-2
    ${required ? "after:content-['*'] after:text-red-500 after:ml-1" : ""}
    ${labelClassName}
  `;

  // Renderizar input según el tipo
  const renderInput = () => {
    switch (type) {
      case "textarea":
        return (
          <Field
            as="textarea"
            name={name}
            id={fieldId}
            placeholder={placeholder || label}
            className={`${baseInputStyles} min-h-[100px] resize-y`}
            aria-label={ariaLabel}
            aria-describedby={ariaDescribedby}
          />
        );
      
      case "select":
        return (
          <Field
            as="select"
            name={name}
            id={fieldId}
            className={baseInputStyles}
            aria-label={ariaLabel}
            aria-describedby={ariaDescribedby}
          >
            <option value="">Seleccionar...</option>
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </Field>
        );
      
      default:
        return (
          <div className="relative">
            <Field
              type={inputType}
              name={name}
              id={fieldId}
              placeholder={placeholder || label}
              className={`${baseInputStyles} ${isPassword ? "pr-10" : ""}`}
              aria-label={ariaLabel}
              aria-describedby={ariaDescribedby}
            />
            {isPassword && (
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            )}
          </div>
        );
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label con icono y tooltip */}
      <label htmlFor={fieldId} className={baseLabelStyles}>
        <div className="flex items-center gap-2">
          {icon && <span className="text-lg text-gray-600">{icon}</span>}
          <span>{label}</span>
          {tooltip && (
            <div
              className="relative inline-block"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <span className="text-blue-500 cursor-pointer">
                <FiAlertCircle size={16} />
              </span>
              {showTooltip && (
                <div className="absolute z-50 p-3 text-xs text-white bg-gray-900 rounded-lg shadow-lg whitespace-normal max-w-xs min-w-[200px] -top-2 transform -translate-y-full">
                  {tooltip}
                  <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45 top-full left-2 -mt-1"></div>
                </div>
              )}
            </div>
          )}
        </div>
      </label>

      {/* Input */}
      {renderInput()}

      {/* Error message */}
      <ErrorMessage
        name={name}
        component="div"
        className="text-sm text-red-600 mt-1"
      />
    </div>
  );
};

export default FormField;
