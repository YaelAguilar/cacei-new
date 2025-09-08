export class Menu {
  private readonly submenuCount?: number;

  constructor(
    private readonly uuid: string,
    private readonly name: string,
    private readonly description: string,
    private readonly icon: string,
    private readonly path: string,
    private readonly orden: number,
    private readonly active: boolean,
    private readonly is_navegable: boolean,
    private readonly component_name: string,
    private readonly feature_name: string,
    submenuCount?: number
  ) {
    this.submenuCount = submenuCount;
  }

  getUuid() { return this.uuid; }
  getName() { return this.name; }
  getDescription() { return this.description; }
  getIcon() { return this.icon; }
  getPath() { return this.path; }
  getOrden() { return this.orden; }
  getActivo() { return this.active; }
  getSubmenuCount() { return this.submenuCount || 0; }
  getIsNavegable() { return this.is_navegable; }
  getComponentName() { return this.component_name; }
  getFeatureName() { return this.feature_name; }
}
