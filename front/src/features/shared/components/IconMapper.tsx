import React from 'react';
import * as LuIcons from 'react-icons/lu';

// Creamos un tipo para nuestro objeto de iconos
type IconsType = {
  [key: string]: React.ComponentType<any>;
}

// Creamos un objeto que mapea los nombres de iconos a sus componentes
export const Icons: IconsType = {
  // Mapeamos automáticamente todos los iconos de react-icons/lu
  ...LuIcons
};

// Función que renderiza un icono basado en su nombre
export const renderIcon = (iconName: string): React.ReactNode => {
  // Quitamos los posibles caracteres < /> si los hay
  const cleanIconName = iconName.replace(/[<>/]/g, '').trim();
  
  // Verificamos si el iconName existe en nuestro objeto de iconos
  if (cleanIconName in Icons) {
    const IconComponent = Icons[cleanIconName];
    return <IconComponent />;
  }
  
  // Si no existe, regresamos null o un icono por defecto
  console.warn(`Icono "${iconName}" no encontrado`);
  return null;
};

// Componente que recibe el nombre del icono como prop
interface DynamicIconProps {
  iconName: string;
  className?: string;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ iconName, className }) => {
  return (
    <div className={className}>
      {renderIcon(iconName)}
    </div>
  );
};