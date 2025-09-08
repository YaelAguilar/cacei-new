import React from "react";

type StatusIndicatorProps = {
  active?: boolean;
  label?: string;
  className?: string;
};

const Status: React.FC<StatusIndicatorProps> = ({
  active = true,
  label = "Activo",
  className = "",
}) => {
  return (
    <div
      className={`
      inline-flex items-center px-3 py-1 
      rounded-full border-2  
      ${active ? "text-green-500 bg-[#E5F5E4] border-green-500" : "text-gray-500 border-gray-500 bg-gray-200"}
      ${className}
    `}
    >
      <div
        className={`w-2 h-2 rounded-full mr-2 ${
          active ? "bg-green-500" : "bg-gray-500"
        }`}
      />
      <span className=" font-semibold text-[11px]">{label}</span>
    </div>
  );
};

export default Status;
