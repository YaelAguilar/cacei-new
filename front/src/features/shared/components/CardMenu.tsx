import React from "react";
import ToggleProps from "./ToggleProps";
import { DynamicIcon } from "./IconMapper";
import { FaRegTrashAlt } from "react-icons/fa";
import { GoPencil } from "react-icons/go";

type Props = {
  icon?: string;
  id: string;
  name: string;
  submenus?: number;
  component_name?: string;
  feature_name?: string;
  ruta: string;
  orden: number;
  isActive?: boolean;
  isNavegable?: boolean; // Si es navegable directamente o solo organizacional
  backgroundColor?: string; // Nueva propiedad para color de fondo
  onEdit?: () => void;
  onDelete?: () => void;
  onToggle?: (checked: boolean) => void;
};

const CardMenu: React.FC<Props> = ({
  icon,
  id,
  name,
  submenus,
  component_name,
  feature_name,
  ruta,
  orden,
  isActive = true,
  isNavegable = false, // Valor por defecto
  backgroundColor = "bg-fuchsia-500", // Valor por defecto
  onEdit = () => {},
  onDelete = () => {},
  onToggle = () => {},
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden w-full">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {icon != null ? (
            <div
              className={`${backgroundColor} w-14 h-14 rounded-lg flex items-center justify-center text-white text-2xl`}
            >
              <DynamicIcon iconName={icon} />
            </div>
          ) : null}
          <div>
            <h2 className="text-2xl font-bold">{name}</h2>
            <p className="text-gray-500 text-sm">{id}</p>
          </div>
        </div>
        <ToggleProps checked={isActive} onChange={onToggle} />
      </div>

      <div className="border-t border-gray-100 px-4 py-3 flex items-center justify-between">
        <div className="space-y-1">
            
          {component_name !== undefined && component_name !== null && (
            <div className="flex items-center gap-1">
              <span className="font-bold">Nombre Vista:</span>
              <span>{component_name}</span>
            </div>
          )}

          {feature_name !== undefined && (
            <div className="flex items-center gap-1">
              <span className="font-bold">Agrupador:</span>
              <span>{feature_name}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <span className="font-bold">Ruta:</span>
            <span>{ruta}</span>
          </div>

          {submenus !== undefined && isNavegable == false && (
            <div className="flex items-center gap-1">
              <span className="font-bold">Submenus:</span>
              <span>{submenus}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          <span className="font-bold">Orden:</span>
          <span>{orden}</span>
        </div>
      </div>

      <div className="border-t border-gray-100 p-2 flex justify-end gap-2">
        <button
          onClick={onEdit}
          className="p-2 rounded-md border border-gray-100 hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Editar"
        >
          <GoPencil />
        </button>
        <button
          onClick={onDelete}
          className="p-2 rounded-md border border-gray-100 hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Eliminar"
        >
          <FaRegTrashAlt className="text-red-500" />
        </button>
      </div>
    </div>
  );
};

export default CardMenu;
