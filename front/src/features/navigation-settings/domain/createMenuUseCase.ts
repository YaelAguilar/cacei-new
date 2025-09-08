import { Menu } from "../data/models/Menu";
import { MenuRepository } from "../data/repository/MenuRepository";

export class CreateMenuUseCase{
    private repository: MenuRepository;

    constructor(repository: MenuRepository){
        this.repository = repository;
    }

    async execute(
        name: string,
        description: string,
        icon: string,
        path: string,
        order: number,
        is_navegable: boolean,
        component_name: string, // Puede ser null si no es navegable
        feature_name: string,
    ): Promise<Menu | null>{
        if (!name || name.trim().length === 0) {
            throw new Error("El nombre es obligatorio");
        }

        if (!description || description.trim().length === 0) {
            throw new Error("La description es obligatoria");
        }

        if (!icon || icon.trim().length === 0) {
            throw new Error("El icono es obligatoria");
        }

        if (!path || path.trim().length === 0) {
            throw new Error("El path es obligatoria");
        }


        const menu = new Menu("",name, description, icon, path, order, true, is_navegable, component_name, feature_name);

        return this.repository.create(menu);
    }
}