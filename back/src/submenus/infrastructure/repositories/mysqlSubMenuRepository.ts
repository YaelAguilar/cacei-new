import { query } from "../../../database/mysql";
import { SubMenuRepository } from "../../domain/interfaces/subMenuRepository";
import { SubMenu } from "../../domain/models/submenu";
import { v4 as uuidv4 } from 'uuid';

export class MysqlSubMenuRepository implements SubMenuRepository {

  async createSubMenu(
    name: string,
    description: string,
    component_name: string,
    path: string,
    sort_order: number,
    menuUuid: string
  ): Promise<SubMenu | null> {

    const sql = "INSERT INTO submenus(uuid, name, description, component_name, path, sort_order) VALUES (?, ?, ?, ?, ?, ?)";
    const uuid = uuidv4();
    const params: any[] = [uuid, name, description, component_name, path, sort_order];

    try {
      const result: any = await query(sql, params);

      if (result?.insertId) {
        const submenuId = result.insertId;

        const menuQuery = "SELECT id FROM menus WHERE uuid = ?";
        const menuResult: any[] = await query(menuQuery, [menuUuid]);

        if (menuResult.length === 0) {
          throw new Error("Menu with given UUID not found");
        }

        const menuId = menuResult[0].id;

        const relUuid = uuidv4();
        const insertRelationSQL = `
          INSERT INTO menu_submenu(uuid, id_menu, id_submenu) VALUES (?, ?, ?)
        `;
        await query(insertRelationSQL, [relUuid, menuId, submenuId]);

        const newSubmenu: any[] = await query('SELECT * FROM submenus WHERE id = ?', [submenuId]);

        if (newSubmenu.length > 0) {
          const row = newSubmenu[0];
          return new SubMenu(row.uuid, row.name, row.description, row.icon, row.path, row.sort_order, row.active, row.component_name);
        }
      }

      return null;

    } catch (error) {
      console.error('Error creating menu:', error);
      return null;
    }
  }

  async getSubMenu(uuid: string): Promise<SubMenu | null> {
    const sql = "SELECT * FROM submenus  WHERE uuid = ?";
    const params: any[] = [uuid];
    try {
      const result: any = await query(sql, params);
      if (result.length > 0) {
        const m = result[0];

        return new SubMenu(
          m.uuid,
          m.name,
          m.description,
          m.icon,
          m.path,
          m.active,
          m.sort_order,
          m.component_name
        );
      } else {
        return null;
      }
    } catch (error) {
      throw new Error(`Error obtaining menu: ${error}`);
    }
  }

  async updateSubMenu(uuid: string, updatedData: Partial<SubMenu>): Promise<SubMenu | null> {

    const fields: string[] = [];
    const params: any[] = [];

    if (updatedData.getName?.()) {
      fields.push("name = ?");
      params.push(updatedData.getName());
    }
    if (updatedData.getDescription?.()) {
      fields.push("description = ?");
      params.push(updatedData.getDescription());
    }
    if (updatedData.getPath?.()) {
      fields.push("path = ?");
      params.push(updatedData.getPath());
    }
    if (updatedData.getComponentName?.()) {
      fields.push("component_name = ?");
      params.push(updatedData.getComponentName());
    }
    if (updatedData.getOrder?.() !== undefined){
      fields.push("sort_order = ?");
      params.push(updatedData.getOrder());
    }
    params.push(uuid);

    if (fields.length === 0) {
      return null; // No hay campos para actualizar
    }

    const sql = `UPDATE submenus SET ${fields.join(", ")} WHERE uuid = ?`;
    try {
      const result: any = await query(sql, params);

      if (result.affectedRows === 0 || result.changedRows === 0) {
        return null;
      }

      const updateMenu: any = await query('SELECT * FROM submenus WHERE uuid = ?', [uuid]);

      if (updateMenu.length > 0) {
        return new SubMenu(
          updateMenu[0].uuid, 
          updateMenu[0].name, 
          updateMenu[0].description, 
          updateMenu[0].icon,
          updateMenu[0].path, 
          updateMenu[0].sort_order,
          updateMenu[0].active, 
          updateMenu[0].component_name
        );
      }

      return null;

    } catch (error) {
      console.error('Error updating submenu:', error);
      throw new Error('Error updating submenu: ' + error);
    }
  }

  async deleteSubMenu(uuid: string): Promise<SubMenu | null> {
    const sql = "UPDATE submenus SET deleted = true WHERE uuid = ?";
    const params: any[] = [uuid];
    try {
      const result: any = await query(sql, params);
      return result;
    } catch (error) {
      throw new Error(`Error deleting submenu: ${error}`);
    }
  }

  async toggleSubmenuStatus(uuid: string, active: boolean): Promise<boolean> {
    const sql = "UPDATE submenus SET active = ? WHERE uuid = ?";
    const params: any[] = [active, uuid];

    try {
      const result: any = await query(sql, params);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error al cambiar el estado del menú: ${error}`);
    }
  }

}
