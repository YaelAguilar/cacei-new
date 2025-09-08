import { Menu, Submenu, RouteConfig, menuToRouteConfig, submenuToRouteConfig } from '../../features/auth/data/models/MenuPermission';

export interface NavigationItem {
  id: string;
  name: string;
  path: string;
  fullPath: string; // Nueva: ruta completa para submenús
  icon: string;
  order: number;
  children?: NavigationItem[];
  // Nuevas propiedades para auto-discovery
  componentName?: string;
  featureName?: string;
  isNavigable?: boolean;
}

export class NavigationHelper {
  /**
   * Construye el árbol de navegación desde los menús del usuario
   * Mantiene compatibilidad con tu estructura actual pero agrega auto-discovery
   */
  static buildNavigationTree(menus: Menu[]): NavigationItem[] {
    return menus
      .filter(menu => menu.attributes.assigned && menu.attributes.active)
      .sort((a, b) => a.attributes.orden - b.attributes.orden)
      .map(menu => {
        const navigationItem: NavigationItem = {
          id: menu.id,
          name: menu.attributes.name,
          path: menu.attributes.path,
          fullPath: menu.attributes.path,
          icon: menu.attributes.icon,
          order: menu.attributes.orden,
          componentName: menu.attributes.component_name,
          featureName: menu.attributes.feature_name,
          isNavigable: menu.attributes.is_navegable,
          children: []
        };

        // Agregar submenús si existen
        if (menu.relationships.submenus.data.length > 0) {
          navigationItem.children = menu.relationships.submenus.data
            .filter(submenu => submenu.attributes.assigned && submenu.attributes.active)
            .sort((a, b) => a.attributes.orden - b.attributes.orden)
            .map(submenu => ({
              id: submenu.id,
              name: submenu.attributes.name,
              path: submenu.attributes.path,
              fullPath: `${menu.attributes.path}${submenu.attributes.path}`, // Ruta completa
              icon: submenu.attributes.icon,
              order: submenu.attributes.orden,
              componentName: submenu.attributes.component_name,
              featureName: menu.attributes.feature_name, // Hereda del padre
              isNavigable: !!submenu.attributes.component_name // Navegable si tiene componente
            }));
        }

        return navigationItem;
      });
  }

  /**
   * Genera todas las rutas para auto-discovery
   */
  static generateDynamicRoutes(menus: Menu[]): RouteConfig[] {
    const routes: RouteConfig[] = [];

    menus.forEach(menu => {
      // Agregar ruta del menú principal si es navegable
      const menuRoute = menuToRouteConfig(menu);
      if (menuRoute) {
        routes.push(menuRoute);
      }

      // Agregar rutas de submenús
      menu.relationships.submenus.data.forEach(submenu => {
        const submenuRoute = submenuToRouteConfig(
          submenu, 
          menu.attributes.path, 
          menu.attributes.feature_name
        );
        if (submenuRoute) {
          routes.push(submenuRoute);
        }
      });
    });

    return routes;
  }

  /**
   * Obtiene menús organizacionales (para selector en admin)
   */
  static getOrganizationalMenus(menus: Menu[]): Menu[] {
    return menus.filter(menu => 
      menu.attributes.active && 
      menu.attributes.is_navegable === false &&
      menu.attributes.feature_name // Debe tener feature para sus submenús
    );
  }

  /**
   * Obtiene menús navegables directamente
   */
  static getNavigableMenus(menus: Menu[]): Menu[] {
    return menus.filter(menu => 
      menu.attributes.active && 
      menu.attributes.is_navegable === true &&
      menu.attributes.component_name
    );
  }

  /**
   * Encuentra rutas que requieren redirección automática
   * (menús organizacionales que deben redirigir al primer submenú)
   */
  static getAutoRedirects(menus: Menu[]): Array<{from: string, to: string}> {
    const redirects: Array<{from: string, to: string}> = [];

    const organizationalMenus = this.getOrganizationalMenus(menus);
    
    organizationalMenus.forEach(menu => {
      const firstNavigableSubmenu = menu.relationships.submenus.data.find(
        submenu => submenu.attributes.assigned && 
                  submenu.attributes.active &&
                  submenu.attributes.component_name
      );

      if (firstNavigableSubmenu) {
        redirects.push({
          from: menu.attributes.path,
          to: `${menu.attributes.path}${firstNavigableSubmenu.attributes.path}`
        });
      }
    });

    return redirects;
  }

 
  /**
   * Obtiene todas las rutas permitidas (mantiene compatibilidad)
   */
  static getAllowedPaths(menus: Menu[]): string[] {
    const paths: string[] = [];
    
    menus.forEach(menu => {
      if (menu.attributes.assigned) {
        paths.push(menu.attributes.path);
      }
      
      menu.relationships.submenus.data.forEach(submenu => {
        if (submenu.attributes.assigned) {
          // Agregar ruta completa del submenú
          paths.push(`${menu.attributes.path}${submenu.attributes.path}`);
        }
      });
    });
    
    return [...new Set(paths)];
  }

  /**
   * Busca menú por ruta (mantiene compatibilidad pero mejorado)
   */
  static findMenuByPath(menus: Menu[], path: string): Menu | null {
    // Buscar en menús principales
    const directMenu = menus.find(menu => menu.attributes.path === path);
    if (directMenu) return directMenu;

    // Buscar en submenús (ruta completa)
    return menus.find(menu => 
      menu.relationships.submenus.data.some(submenu => 
        `${menu.attributes.path}${submenu.attributes.path}` === path
      )
    ) || null;
  }

  /**
   * Busca submenú por ruta completa (mejorado)
   */
  static findSubmenuByPath(menus: Menu[], fullPath: string): Submenu | null {
    for (const menu of menus) {
      const submenu = menu.relationships.submenus.data.find(sub => 
        `${menu.attributes.path}${sub.attributes.path}` === fullPath
      );
      if (submenu) return submenu;
    }
    return null;
  }

  /**
   * Obtiene información de auto-discovery para una ruta específica
   */
  static getAutoDiscoveryInfo(menus: Menu[], path: string): {
    componentName?: string;
    featureName?: string;
    isNavigable?: boolean;
  } | null {
    const routes = this.generateDynamicRoutes(menus);
    const route = routes.find(r => r.path === path);
    
    if (!route) return null;

    return {
      componentName: route.componentName,
      featureName: route.featureName,
      isNavigable: route.isNavigable
    };
  }
}