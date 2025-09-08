import { Menu } from "../domain/models/menu";
import { MenuRepository } from "../domain/interfaces/menuRepository";

export class GetAllMenuUseCase {
    constructor(private readonly menuRepository : MenuRepository){}

    async execute():Promise<Menu[] | null>{
        try {
            const menus = await this.menuRepository.getMenus();
            return menus;
        } catch (error) {
            console.error("Error en GetAllMenuUseCase:", error);
            throw error;
        }
    }

}