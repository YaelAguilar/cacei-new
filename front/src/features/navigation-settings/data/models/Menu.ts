export class Menu {
    constructor(
        public uuid: string,
        public name: string,
        public description: string,
        public icon: string,
        public path: string,
        public order: number,
        public active: boolean,
        public is_navegable: boolean,   // Si es navegable directamente o solo organizacional
        public component_name: string,  // Componente React (NULL si organizacional)
        public feature_name: string 
    ) {}
}