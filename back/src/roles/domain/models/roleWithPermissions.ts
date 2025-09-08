export interface RoleWithPermissions {
  uuid: string;
  name: string;
  description: string;
  active: boolean;
  availablePermissions: {
    menus: MenuWithPermission[];
  };
}

export interface MenuWithPermission {
  uuid: string;
  name: string;
  description: string;
  icon: string;
  path: string;
  orden: number;
  active: boolean;
  assigned: boolean; // Indica si este menú está asignado al rol
  is_navegable?: boolean;   // Si es navegable directamente o solo organizacional
  component_name?: string;  // Componente React (NULL si organizacional)
  feature_name?: string;
  submenus: SubMenuWithPermission[];
}

export interface SubMenuWithPermission {
  uuid: string;
  name: string;
  description: string;
  icon: string;
  path: string;
  orden: number;
  active: boolean;
  assigned: boolean; // Indica si este submenú está asignado al rol
  component_name: string; // Nombre del componente asociado al submenú
}
