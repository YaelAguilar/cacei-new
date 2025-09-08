import React from "react";

type Props = {
  isAdd?: boolean;
  onClick?: () => void;
  label?: string;
  type?: "button" | "submit" | "reset";
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string; // para estilos custom
};

const Button: React.FC<Props> = ({
  isAdd = true,
  onClick,
  label = "",
  type = "submit",
  icon,
  disabled = false,
  className = "",
}) => {
  const baseStyles = `
    inline-flex items-center gap-2 cursor-pointer poppins
    px-4 py-3 rounded-md font-semibold text-sm transition-all
  `;

  const activeStyles = isAdd
    ? "bg-[#498FD0] text-white hover:bg-[#498fd0af]"
    : "border border-gray-400 text-gray-400 hover:bg-gray-200";

  const disabledStyles = "opacity-50 cursor-not-allowed";

  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`${baseStyles} ${activeStyles} ${disabled ? disabledStyles : ""} ${className}`}
    >
      {icon && <span className="icon">{icon}</span>}
      {label}
    </button>
  );
};


export default Button;
