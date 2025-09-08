export interface Submenu {
  type: string;
  id: string;
  attributes: {
    name: string;
    description: string;
    icon: string;
    path: string;
    orden: number;
    active: boolean;
    assigned: boolean;
    component_name?: string;
  };
}

export interface Menu {
  type: string;
  id: string;
  attributes: {
    name: string;
    description: string;
    icon: string;
    path: string;
    orden: number;
    active: boolean;
    assigned: boolean;
    is_navegable?: boolean;   // Si es navegable directamente o solo organizacional
    component_name?: string;  // Componente React (NULL si organizacional)
    feature_name?: string; 
  };
  relationships: {
    submenus: {
      data: Submenu[];
    };
  };
}

export interface UserPermissions {
  menus: Menu[];
}

export interface RolePermissionResponse {
  data: {
    type: string;
    id: string;
    attributes: {
      name: string;
      description: string;
      active: boolean;
    };
    relationships: {
      availablePermissions: UserPermissions;
    };
  };
}

// NUEVOS TIPOS PARA AUTO-DISCOVERY

export interface RouteConfig {
  path: string;
  componentName: string;
  featureName?: string;
  requiredPath: string;
  parentPath?: string;
  isNavigable: boolean;
}

export interface NavigationRoute {
  id: string;
  name: string;
  path: string;
  fullPath: string;
  icon: string;
  order: number;
  componentName?: string;
  featureName?: string;
  isNavigable: boolean;
  children?: NavigationRoute[];
}

// HELPERS PARA TRANSFORMAR A ROUTECONFIG

//Convierte un Menu a RouteConfig para auto-discovery
export const menuToRouteConfig = (menu: Menu): RouteConfig | null => {
  // Solo crear ruta si está asignado, activo y es navegable
  if (!menu.attributes.assigned || 
      !menu.attributes.active || 
      !menu.attributes.is_navegable ||
      !menu.attributes.component_name) {
    return null;
  }

  return {
    path: menu.attributes.path,
    componentName: menu.attributes.component_name,
    featureName: menu.attributes.feature_name,
    requiredPath: menu.attributes.path,
    isNavigable: true
  };
};

//Convierte un Submenu a RouteConfig para auto-discovery
export const submenuToRouteConfig = (
  submenu: Submenu, 
  parentPath: string, 
  parentFeatureName?: string
): RouteConfig | null => {
  // Solo crear ruta si está asignado, activo y tiene componente
  if (!submenu.attributes.assigned || 
      !submenu.attributes.active ||
      !submenu.attributes.component_name) {
    return null;
  }

  const fullPath = `${parentPath}${submenu.attributes.path}`;

  return {
    path: fullPath,
    componentName: submenu.attributes.component_name,
    featureName: parentFeatureName, // Siempre hereda del menú padre
    requiredPath: fullPath,
    parentPath,
    isNavigable: true
  };
};

//Valida si un menú es organizacional (agrupa submenús)
export const isOrganizationalMenu = (menu: Menu): boolean => {
  return menu.attributes.is_navegable === false && 
         !menu.attributes.component_name &&
         menu.attributes.feature_name !== null;
};

//Valida si un menú es navegable directamente
export const isNavigableMenu = (menu: Menu): boolean => {
  return menu.attributes.is_navegable === true && 
         menu.attributes.component_name !== null &&
         menu.attributes.feature_name !== null;
};