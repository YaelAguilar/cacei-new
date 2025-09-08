import React, { useState } from "react";
import { Field } from "formik";
import { FiEye, FiEyeOff, FiAlertCircle } from "react-icons/fi";

type Props = {
  icon?: React.ReactNode;
  type: string;
  name: string;
  id: string;
  label: string;
  tooltip?: string;
};

const WrapperInput: React.FC<Props> = ({ icon, type, name, id, label, tooltip }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 mb-4">
      <label
        htmlFor={id}
        className={`text-sm text-gray-700 w-full md:w-1/4 flex items-center gap-2`}
      >
        {icon && <span className="text-lg">{icon}</span>}
        {label}
        {tooltip && (
          <div
            className="relative inline-block"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <span className="text-blue-500 cursor-pointer">
              <FiAlertCircle size={18} />
            </span>
            {showTooltip && (
              <div className="absolute z-50 p-3 text-xs text-white bg-gray-900 rounded-lg shadow-lg whitespace-normal max-w-xl min-w-[250px] -top-2 transform -translate-y-full">
                {tooltip}
                {/* Flecha del tooltip */}
                <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45 top-full left-2 -mt-1"></div>
              </div>
            )}
          </div>
        )}
      </label>
      <div className="relative w-full md:w-3/4">
        <Field
          type={inputType}
          name={name}
          id={id}
          placeholder={label}
          className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? (
              <FiEyeOff size={20} aria-label="Ocultar contraseña" />
            ) : (
              <FiEye size={20} aria-label="Mostrar contraseña" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default WrapperInput;