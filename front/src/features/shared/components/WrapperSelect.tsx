import React from "react";
import { useField, useFormikContext } from "formik";
import Select from "react-select";

type OptionType = {
  value: string | boolean | number;
  label: string;
};

type Props = {
  icon?: React.ReactNode;
  name: string;
  id: string;
  label: string;
  options: OptionType[];
  disabled?: boolean;
  placeholder?: string;
  isClearable?: boolean;
};

const WrapperSelect: React.FC<Props> = ({
  icon,
  name,
  id,
  label,
  options,
  disabled = false,
  placeholder = "Selecciona una opción",
  isClearable = false,
}) => {
  const [field, meta, helpers] = useField(name);
  const { setFieldValue } = useFormikContext();

  // Encontrar la opción seleccionada basada en el valor actual
  const selectedOption = options.find(option => option.value === field.value);

  // Manejar el cambio de valor
  const handleChange = (selectedOption: any) => {
    setFieldValue(name, selectedOption ? selectedOption.value : "");
  };

  // Estilos personalizados para React Select
  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      borderColor: meta.touched && meta.error ? "#ef4444" : provided.borderColor,
      boxShadow: state.isFocused ? "0 0 0 2px rgba(59, 130, 246, 0.5)" : "none",
      "&:hover": {
        borderColor: state.isFocused ? "rgba(59, 130, 246, 0.5)" : provided.borderColor,
      },
      borderRadius: "0.375rem",
      minHeight: "38px",
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: "#9ca3af",
      fontSize: "0.875rem",
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#3b82f6" : state.isFocused ? "#dbeafe" : "white",
      color: state.isSelected ? "white" : "#374151",
      fontSize: "0.875rem",
      cursor: "pointer",
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: "#374151",
      fontSize: "0.875rem",
    }),
    input: (provided: any) => ({
      ...provided,
      fontSize: "0.875rem",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      color: "#9ca3af",
      "&:hover": {
        color: "#6b7280",
      },
    }),
    menuPortal: (provided: any) => ({
      ...provided,
      zIndex: 9999,
    }),
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 mb-4">
      <label
        htmlFor={id}
        className={`text-sm text-gray-700 w-full md:w-1/4 ${
          icon ? "flex items-center gap-2" : ""
        }`}
      >
        {icon && <span className="text-lg">{icon}</span>}
        {label}
      </label>
      <div className="w-full md:w-3/4">
        <Select
          id={id}
          options={options}
          value={selectedOption}
          onChange={handleChange}
          onBlur={field.onBlur}
          isDisabled={disabled}
          placeholder={placeholder}
          isClearable={isClearable}
          styles={customStyles}
          className="text-sm"
          menuPortalTarget={document.body}
          menuPosition="fixed"
        />
        {meta.touched && meta.error ? (
          <div className="mt-1 text-sm text-red-600">{meta.error}</div>
        ) : null}
      </div>
    </div>
  );
};

export default WrapperSelect;