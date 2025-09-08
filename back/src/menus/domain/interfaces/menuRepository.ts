import { Menu } from "../models/menu";
import { SubMenuRef } from "../models/subMenuRef";
import { MenuWithSubmenus } from "../models/menuWithSubmenus";

export interface MenuRepository {
  createMenu(
    name: string,
    description: string,
    icon: string,
    path: string,
    orden: number,
    is_navegable: boolean,
    component_name: string,
    feature_name: string
  ): Promise<Menu | null>;

  getMenu(uuid: string): Promise<Menu | null>;

  getMenus(): Promise<Menu[] | null>;

  updateMenu(
    uuid: string,
    updatedData: Partial<Menu>
  ): Promise<Menu | null>;

  deleteMenu(uuid: string): Promise<Menu | null>;

  toggleMenuStatus(uuid: string, active: boolean): Promise<boolean>; 

  // Métodos para manejar la relación con submenús
  getSubmenus(menuUuid: string): Promise<SubMenuRef[]>;
  assignSubmenu(menuUuid: string, submenuUuid: string): Promise<boolean>;
  unassignSubmenu(menuUuid: string, submenuUuid: string): Promise<boolean>;

  getAllWithSubmenus(): Promise<MenuWithSubmenus[]>;
}
