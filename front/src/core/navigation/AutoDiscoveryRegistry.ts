import { ComponentType } from 'react';

export class AutoDiscoveryRegistry {
  private static componentCache = new Map<string, ComponentType<any>>();
  private static loadingPromises = new Map<string, Promise<ComponentType<any>>>();
  private static failedComponents = new Set<string>();

  /**
   * Carga un componente dinámicamente basado en convenciones
   */
  static async loadComponent(componentName: string, featureName?: string): Promise<ComponentType<any>> {
    if (this.failedComponents.has(componentName)) {
      throw new Error(`Componente ${componentName} falló previamente`);
    }

    if (this.componentCache.has(componentName)) {
      return this.componentCache.get(componentName)!;
    }

    if (this.loadingPromises.has(componentName)) {
      return this.loadingPromises.get(componentName)!;
    }

    const loadingPromise = this.discoverAndLoadComponent(componentName, featureName);
    this.loadingPromises.set(componentName, loadingPromise);

    try {
      const component = await loadingPromise;
      this.componentCache.set(componentName, component);
      this.loadingPromises.delete(componentName);
      return component;
    } catch (error) {
      this.loadingPromises.delete(componentName);
      this.failedComponents.add(componentName);
      throw error;
    }
  }

  /**
   * Intenta cargar un componente desde múltiples ubicaciones basadas en convenciones
   */
  private static async discoverAndLoadComponent(componentName: string, featureName?: string): Promise<ComponentType<any>> {
    const { path } = this.generateConventionPath(componentName, featureName);

    try {
      const module = await import(/* @vite-ignore */ path);

      let component = module.default || module[componentName];

      if (component && (typeof component === 'function' || typeof component === 'object')) {
        if (typeof component === 'object' && 
            (component.$$typeof || component.render || component.type)) {
          return component;
        }
        else if (typeof component === 'function') {
          return component;
        }
      }
    } catch (error: any) {
      // Silenciar error
    }

    throw new Error(`Componente ${componentName} no encontrado en la ruta esperada`);
  }

  /**
   * Genera rutas basadas en convenciones de nomenclatura del proyecto
   */
  private static generateConventionPath(componentName: string, featureName?: string): { path: string, description: string } {
    if (!featureName) {
      throw new Error(`featureName es requerido para cargar el componente "${componentName}"`);
    }

    const path = `../../features/${featureName}/presentation/pages/${componentName}.tsx`;
    return {
      path,
      description: `Ruta esperada: ../../features/${featureName}/presentation/pages/${componentName}.tsx`
    };
  }
}
