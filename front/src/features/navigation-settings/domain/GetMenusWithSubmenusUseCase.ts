import { Menu } from "../data/models/Menu";
import { Submenu } from "../data/models/Submenu";
import { MenuRepository } from "../data/repository/MenuRepository";

export interface MenuWithSubmenus {
    menu: Menu;
    submenus: Submenu[];
}

export class GetMenusWithSubmenusUseCase {
    constructor(private menuRepository: MenuRepository) {}

    async execute(): Promise<MenuWithSubmenus[]> {
        try {
            const result = await this.menuRepository.getAllWithSubmenus();
            
            if (!result) {
                return [];
            }
            
            // Reorganizar los datos para agrupar los submenús por su menú padre
            const { menus, submenus } = result;
            
            // Crear un mapa para organizar los submenús por menuId
            const submenusByMenuId: { [key: string]: Submenu[] } = {};
            
            // Agrupar submenús por menuId
            submenus.forEach(submenu => {
                if (!submenusByMenuId[submenu.menuId]) {
                    submenusByMenuId[submenu.menuId] = [];
                }
                submenusByMenuId[submenu.menuId].push(submenu);
            });
            
            // Crear array de menús con sus submenús
            return menus.map(menu => ({
                menu,
                submenus: submenusByMenuId[menu.uuid] || []
            }));
        } catch (error) {
            console.error("Error en GetMenusWithSubmenusUseCase:", error);
            return [];
        }
    }
}