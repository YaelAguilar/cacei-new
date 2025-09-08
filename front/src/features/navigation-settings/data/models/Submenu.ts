export class Submenu {
    constructor(
        public uuid: string,
        public menuId: string, // Referencia al menú padre
        public name: string,
        public description: string,
        public icon: string,
        public path: string,
        public order: number,
        public active: boolean,
        public component_name: string
    ) {}
}