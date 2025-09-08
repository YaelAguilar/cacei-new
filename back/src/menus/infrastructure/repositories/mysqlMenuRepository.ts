import { query } from "../../../database/mysql";
import { MenuRepository } from "../../domain/interfaces/menuRepository";
import { Menu } from "../../domain/models/menu";
import { SubMenuRef } from "../../domain/models/subMenuRef";
import { MenuWithSubmenus } from "../../domain/models/menuWithSubmenus";
import { v4 as uuidv4 } from 'uuid';

export class MysqlMenuRepository implements MenuRepository {

  async getMenus(): Promise<Menu[] | null> {
    const sql = `
    SELECT m.*, 
           (SELECT COUNT(*) FROM menu_submenu ms WHERE ms.id_menu = m.id) as submenu_count
    FROM menus m 
    WHERE m.deleted = 0 
    ORDER BY m.sort_order ASC
  `;

    try {
      const results: any[] = await query(sql, []);

      return results.map(m => {
        const menu = new Menu(
          m.uuid,
          m.name,
          m.description,
          m.icon,
          m.path,
          m.sort_order,
          m.active === 1,
          m.is_navegable === 1,
          m.component_name,
          m.feature_name
        );

        // Añadir el conteo como propiedad en el objeto
        (menu as any).submenuCount = m.submenu_count || 0;

        return menu;
      });
    } catch (error) {
      throw new Error(`Error obtaining menus: ${error}`);
    }
  }

  async createMenu(
    name: string,
    description: string,
    icon: string,
    path: string,
    order: number,
    is_navegable: boolean,
    component_name: string,
    feature_name: string,
  ): Promise<Menu | null> {

    const sql = "INSERT INTO menus(uuid, name, description, icon, path, sort_order, is_navegable, component_name, feature_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const uuid = uuidv4();
    const params: any[] = [uuid, name, description, icon, path, order, is_navegable, component_name, feature_name];
    try {
      const result: any = await query(sql, params);

      if (result) {
        const newMenu: any = await query('SELECT * FROM menus WHERE id = ?', [result.insertId]);
        if (newMenu.length > 0) {
          return new Menu(newMenu[0].uuid, newMenu[0].name, newMenu[0].description, newMenu[0].icon, newMenu[0].path, newMenu[0].sort_order, newMenu[0].active, newMenu[0].is_navegable, newMenu[0].component_name, newMenu[0].feature_name); //Viene desde la DB los campos
        }
      }
      return null;

    } catch (error) {
      console.error('Error creating menu:', error);
      return null;
    }
  }

  async getMenu(uuid: string): Promise<Menu | null> {
    const sql = "SELECT * FROM menus  WHERE uuid = ?";
    const params: any[] = [uuid];
    try {
      const result: any = await query(sql, params);
      if (result.length > 0) {
        const m = result[0];

        return new Menu(
          m.uuid,
          m.name,
          m.description,
          m.icon,
          m.path,
          m.sort_order,
          m.active === 1,
          m.is_navegable === 1,
          m.component_name,
          m.feature_name
        );
      } else {
        return null;
      }
    } catch (error) {
      throw new Error(`Error obtaining menu: ${error}`);
    }
  }

  async updateMenu(uuid: string, updatedData: Partial<Menu>): Promise<Menu | null> {

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
    if (updatedData.getIcon?.()) {
      fields.push("icon = ?");
      params.push(updatedData.getIcon());
    }
    if (updatedData.getPath?.()) {
      fields.push("path = ?");
      params.push(updatedData.getPath());
    }
    if (updatedData.getOrden?.() !== undefined) {
      fields.push("sort_order = ?");
      params.push(updatedData.getOrden());
    }
    if (updatedData.getActivo?.() !== undefined) {
      fields.push("active = ?");
      params.push(updatedData.getActivo());
    }
    if (updatedData.getIsNavegable?.() !== undefined) {
      fields.push("is_navegable = ?");
      params.push(updatedData.getIsNavegable());
    }
    if (updatedData.getFeatureName?.() !== undefined) {
      fields.push("feature_name = ?");
      params.push(updatedData.getFeatureName());
    }
    if (updatedData.getComponentName?.() !== undefined) {
      // Si getIsNavegable está definido y es false, component_name debe ser null
      if (updatedData.getIsNavegable?.() === false) {
        fields.push("component_name = ?");
        params.push(null);
      } else {
        fields.push("component_name = ?");
        params.push(updatedData.getComponentName());
      }
    }


    params.push(uuid);

    if (fields.length === 0) {
      return null; // No hay campos para actualizar
    }

    const sql = `UPDATE menus SET ${fields.join(", ")} WHERE uuid = ?`;
    try {
      const result: any = await query(sql, params);

      if (result.affectedRows === 0 || result.changedRows === 0) {
        return null;
      }

      const updateMenu: any = await query('SELECT * FROM menus WHERE uuid = ?', [uuid]);

      if (updateMenu.length > 0) {
        return new Menu(updateMenu[0].uuid, updateMenu[0].name, updateMenu[0].description, updateMenu[0].icon,
          updateMenu[0].path, updateMenu[0].sort_order, updateMenu[0].active, updateMenu[0].is_navegable, updateMenu[0].component_name, updateMenu[0].feature_name); //Viene desde la DB los campos
      }

      return null;

    } catch (error) {
      console.error('Error updating menu:', error);
      throw new Error('Error updating menu: ' + error);
    }
  }

  async deleteMenu(uuid: string): Promise<Menu | null> {
    const sql = "UPDATE menus SET deleted = true WHERE uuid = ?";
    const params: any[] = [uuid];
    try {
      const result: any = await query(sql, params);
      return result;
    } catch (error) {
      throw new Error(`Error deleting menu: ${error}`);
    }
  }

  async toggleMenuStatus(uuid: string, active: boolean): Promise<boolean> {
    const sql = "UPDATE menus SET active = ? WHERE uuid = ?";
    const params: any[] = [active, uuid];

    try {
      const result: any = await query(sql, params);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error al cambiar el estado del menú: ${error}`);
    }
  }

  // Implementación de métodos para submenús
  async getSubmenus(menuUuid: string): Promise<SubMenuRef[]> {
    const sql = `
      SELECT s.* 
      FROM submenus s
      JOIN menu_submenu ms ON s.id = ms.id_submenu
      JOIN menus m ON m.id = ms.id_menu
      WHERE m.uuid = ?
    `;
    const params: any[] = [menuUuid];

    try {
      const results: any[] = await query(sql, params);

      return results.map(s => new SubMenuRef(
        s.uuid,
        s.name,
        s.description,
        s.icon,
        s.path,
        s.sort_order,
        s.active === 1,
        s.component_name || ""  // Asignar un valor por defecto si no existe
      ));
    } catch (error) {
      throw new Error(`Error obtaining submenus for menu: ${error}`);
    }
  }

  async assignSubmenu(menuUuid: string, submenuUuid: string): Promise<boolean> {
    // Primero, obtener los IDs numéricos a partir de los UUIDs
    const menuIdSql = "SELECT id FROM menus WHERE uuid = ?";
    const submenuIdSql = "SELECT id FROM submenus WHERE uuid = ?";

    try {
      // Obtener ID del menú
      const menuResult: any = await query(menuIdSql, [menuUuid]);
      if (menuResult.length === 0) {
        throw new Error(`Menu with UUID ${menuUuid} not found`);
      }
      const menuId = menuResult[0].id;

      // Obtener ID del submenú
      const submenuResult: any = await query(submenuIdSql, [submenuUuid]);
      if (submenuResult.length === 0) {
        throw new Error(`Submenu with UUID ${submenuUuid} not found`);
      }
      const submenuId = submenuResult[0].id;

      // Verificar si ya existe la relación
      const checkSql = "SELECT id FROM menu_submenu WHERE id_menu = ? AND id_submenu = ?";
      const checkResult: any = await query(checkSql, [menuId, submenuId]);

      if (checkResult.length > 0) {
        // La relación ya existe, no es necesario hacer nada
        return true;
      } else {
        // Crear nueva relación
        const insertSql = `
          INSERT INTO menu_submenu (uuid, id_menu, id_submenu) 
          VALUES (?, ?, ?)
        `;
        await query(insertSql, [uuidv4(), menuId, submenuId]);
        return true;
      }
    } catch (error) {
      throw new Error(`Error assigning submenu to menu: ${error}`);
    }
  }

  async unassignSubmenu(menuUuid: string, submenuUuid: string): Promise<boolean> {
    // Primero, obtener los IDs numéricos a partir de los UUIDs
    const menuIdSql = "SELECT id FROM menus WHERE uuid = ?";
    const submenuIdSql = "SELECT id FROM submenus WHERE uuid = ?";

    try {
      // Obtener ID del menú
      const menuResult: any = await query(menuIdSql, [menuUuid]);
      if (menuResult.length === 0) {
        throw new Error(`Menu with UUID ${menuUuid} not found`);
      }
      const menuId = menuResult[0].id;

      // Obtener ID del submenú
      const submenuResult: any = await query(submenuIdSql, [submenuUuid]);
      if (submenuResult.length === 0) {
        throw new Error(`Submenu with UUID ${submenuUuid} not found`);
      }
      const submenuId = submenuResult[0].id;

      // Eliminar la relación
      const deleteSql = "DELETE FROM menu_submenu WHERE id_menu = ? AND id_submenu = ?";
      const result: any = await query(deleteSql, [menuId, submenuId]);

      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error unassigning submenu from menu: ${error}`);
    }
  }

  async getAllWithSubmenus(): Promise<MenuWithSubmenus[]> {
    // Primero obtenemos todos los menús
    const menusSql = `SELECT * FROM menus WHERE deleted = 0 AND active = 1`;

    try {
      const menusData: any[] = await query(menusSql, []);

      // Para cada menú, obtener sus submenús
      const menusWithSubmenus = await Promise.all(menusData.map(async (menuData) => {
        const submenusSql = `
                SELECT s.* 
                FROM submenus s
                JOIN menu_submenu ms ON s.id = ms.id_submenu
                JOIN menus m ON m.id = ms.id_menu
                WHERE m.uuid = ? AND s.deleted = 0
                ORDER BY s.sort_order
            `;

        const submenusData: any[] = await query(submenusSql, [menuData.uuid]);

        // Convertir los datos crudos a objetos SubMenuRef
        const submenus = submenusData.map(s => new SubMenuRef(
          s.uuid,
          s.name,
          s.description,
          s.icon,
          s.path,
          s.sort_order,
          s.active === 1,
          s.component_name || ""  // Asignar un valor por defecto si no existe
        ));

        // Crear un objeto que cumpla con la interfaz MenuWithSubmenus
        return {
          uuid: menuData.uuid,
          name: menuData.name,
          description: menuData.description,
          icon: menuData.icon,
          active: menuData.active === 1,
          submenus: submenus
        };
      }));

      const filteredMenus = menusWithSubmenus.filter(menu => menu.submenus.length > 0);

      return filteredMenus;
    } catch (error) {
      throw new Error(`Error obtaining menus with submenus: ${error}`);
    }
  }

}
