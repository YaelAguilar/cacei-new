export class SubMenu {
  constructor(
        private readonly uuid: string,
        private readonly name: string,
        private readonly description: string,
        private readonly icon: string,
        private readonly path: string,
        private readonly sort_order: number,
        private readonly active: boolean,
        private readonly component_name: string,
    ) { }

    getUuid() { return this.uuid; }
    getName() { return this.name; }
    getDescription() { return this.description; }
    getIcon() { return this.icon; }
    getPath() { return this.path; }
    getOrder() { return this.sort_order; }
    getActive() { return this.active; }
    getComponentName() { return this.component_name; }
}
