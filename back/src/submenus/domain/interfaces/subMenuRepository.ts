import { SubMenu } from "../models/submenu";


export interface SubMenuRepository {
  createSubMenu(
    name: string,
    description: string,
    icon: string,
    path: string,
    sort_order: number,
    uuid_menu: string
  ): Promise<SubMenu | null>;

  getSubMenu(uuid: string): Promise<SubMenu | null>;

  updateSubMenu(
    uuid: string,
    updatedData: Partial<SubMenu>
  ): Promise<SubMenu | null>;

  deleteSubMenu(uuid: string): Promise<SubMenu | null>;

  toggleSubmenuStatus(uuid: string, active: boolean): Promise<boolean>; 
}
