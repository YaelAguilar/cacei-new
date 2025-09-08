import { query } from "../../../database/mysql";
import { PaginationResponse } from "../../../utils/paginationResponse";
import { RoleRepository } from "../../domain/interfaces/roleRepository";
import { Role } from "../../domain/models/role";
import { RoleWithPermissions } from "../../domain/models/roleWithPermissions";
import { v4 as uuidv4 } from 'uuid';

export class MysqlRoleRepository implements RoleRepository {
    async createRole(name: string, description: string): Promise<Role | null> {
        try {
            const uuid = uuidv4();

            const sql = `
                INSERT INTO roles (uuid, name, description)
                VALUES (?, ?, ?)
            `;

            const result: any = await query(sql, [uuid, name, description]);

            return new Role(
                result.insertId,
                uuid,
                name,
                description
            );
        } catch (error) {
            console.error(`Error creating role: ${error}`);
            return null;
        }
    }

    async getRoles(fields: string[] | null, page: number, limit: number): Promise<PaginationResponse<Role> | null> {
        try {
            if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
                throw new Error(`Invalid pagination parameters: page=${page}, limit=${limit}`);
            }

            const defaultFields = ['id', 'uuid', 'name', 'description', 'created_at', 'updated_at'];

            let selectedFields: string[];
            if (fields && fields.length > 0) {
                selectedFields = [...new Set([...defaultFields, ...fields])];
            } else {
                selectedFields = ['*'];
            }

            const selectClause = selectedFields.length === 1 && selectedFields[0] === '*'
                ? 'r.*'
                : selectedFields.map(field => `r.\`${field}\``).join(', ');

            const countResult = await query('SELECT COUNT(*) as total FROM roles', []);
            const total = countResult[0].total;

            const offset = (page - 1) * limit;

            const sql = `
            SELECT ${selectClause},
                   (SELECT COUNT(*) FROM role_menu WHERE id_role = r.id) AS menu_count,
                   (SELECT COUNT(*) FROM role_submenu WHERE id_role = r.id) AS submenu_count,
                   (SELECT COUNT(*) FROM role_users WHERE id_role = r.id AND active = 1) AS user_count
            FROM roles r
            ORDER BY r.created_at DESC
            LIMIT ${limit} OFFSET ${offset}
        `;

            const rolesData = await query(sql, []);

            // Map database results to Role objects
            const roles = rolesData.map((roleData: { id: string | number; uuid: string; name: string; description: string; menu_count: number; submenu_count: number; user_count: number; }) => {
                const role = new Role(
                    roleData.id,
                    roleData.uuid,
                    roleData.name,
                    roleData.description
                );

                (role as any).menuCount = roleData.menu_count || 0;
                (role as any).submenuCount = roleData.submenu_count || 0;
                (role as any).userCount = roleData.user_count || 0;

                return role;
            });

            return {
                pagination: {
                    currentPage: page,
                    limit: limit,
                    total: total,
                },
                data: roles
            };
        } catch (error) {
            console.error(`Error retrieving roles:`, error);
            return null;
        }
    }

    async getRole(uuid: string, fields: string[] | null): Promise<Role | null> {
        try {
            // Definir campos predeterminados
            const defaultFields = ['uuid', 'created_at', 'updated_at'];

            // Combinar campos predeterminados con campos solicitados (si los hay)
            let selectedFields: string[];
            if (fields && fields.length > 0) {
                // Eliminar duplicados
                selectedFields = [...new Set([...defaultFields, ...fields])];
            } else {
                selectedFields = ['*']; // Seleccionar todos los campos si no se especifican
            }

            // Construir la consulta de selección
            const selectClause = selectedFields.length === 1 && selectedFields[0] === '*'
                ? '*'
                : selectedFields.join(', ');

            const sql = `
                SELECT ${selectClause}
                FROM roles
                WHERE uuid = ?
                LIMIT 1
            `;

            const results = await query(sql, [uuid]);

            if (results.length === 0) {
                return null;
            }

            return results[0];
        } catch (error) {
            console.error(`Error retrieving role: ${error}`);
            return null;
        }
    }

    async updateRol(uuid: string, updatedData: Partial<Role>): Promise<Role | null> {
        try {
            const fields: string[] = [];
            const params: any[] = [];

            if (updatedData.getName) {
                fields.push("name = ?");
                params.push(updatedData.getName());
            }

            if (updatedData.getDescription) {
                fields.push("description = ?");
                params.push(updatedData.getDescription);
            }

            // Si no hay campos para actualizar, retornar null
            if (fields.length === 0) {
                return null;
            }

            params.push(uuid);

            const sql = `UPDATE roles SET ${fields.join(", ")} WHERE uuid = ?`;

            const result: any = await query(sql, params);

            if (result.affectedRows === 0) {
                return null;
            }

            // Obtener el rol actualizado
            return this.getRole(uuid, null);
        } catch (error) {
            console.error(`Error updating role: ${error}`);
            return null;
        }
    }

    async deleteRole(uuid: string): Promise<Role | null> {
        try {
            // Obtener el rol antes de desactivarlo
            const roleToDelete = await this.getRole(uuid, null);
            if (!roleToDelete) {
                return null;
            }

            const sql = `UPDATE roles SET active = false WHERE uuid = ?`;
            const result: any = await query(sql, [uuid]);

            return roleToDelete;
        } catch (error) {
            console.error(`Error deleting role: ${error}`);
            throw new Error(`Error deleting role: ${error}`);
        }
    }

    // Implementación para submenus y menus a los roles

    async getRolePermissions(roleId: string): Promise<RoleWithPermissions | null> {
        try {
            // 1. Obtener información del rol
            const roleSql = "SELECT * FROM roles WHERE uuid = ?";
            const roleData: any[] = await query(roleSql, [roleId]);

            if (roleData.length === 0) {
                throw new Error(`Role with UUID ${roleId} not found`);
            }

            const role = roleData[0];
            const roleId_numeric = role.id;

            // 2. Obtener todos los menús disponibles en el sistema y marcar cuáles están asignados al rol
            const menusSql = `
            SELECT m.*, 
                   CASE WHEN rm.id IS NOT NULL THEN 1 ELSE 0 END AS assigned
            FROM menus m 
            LEFT JOIN role_menu rm ON m.id = rm.id_menu AND rm.id_role = ?
            WHERE m.deleted = 0 AND m.active = 1
            ORDER BY m.sort_order ASC
        `;

            const menusData: any[] = await query(menusSql, [roleId_numeric]);

            // 3. Para cada menú, obtener todos sus submenús y marcar cuáles están asignados al rol
            const menusWithPermissions = await Promise.all(menusData.map(async (menuData) => {
                // 3.1 Obtener todos los submenús de este menú
                const allSubmenusSql = `
                SELECT s.*, 
                       CASE WHEN rs.id IS NOT NULL THEN 1 ELSE 0 END AS assigned
                FROM submenus s
                INNER JOIN menu_submenu ms ON s.id = ms.id_submenu
                LEFT JOIN role_submenu rs ON s.id = rs.id_submenu AND rs.id_role = ?
                WHERE ms.id_menu = ? AND s.deleted = 0 AND s.active = 1
                ORDER BY s.sort_order ASC
            `;

                const submenusData: any[] = await query(allSubmenusSql, [roleId_numeric, menuData.id]);

                // 3.2 Convertir a objetos SubMenuWithPermission
                const submenus = submenusData.map(s => ({
                    uuid: s.uuid,
                    name: s.name,
                    description: s.description,
                    icon: s.icon,
                    path: s.path,
                    orden: s.sort_order,
                    active: s.active === 1,
                    assigned: s.assigned === 1,
                    component_name: s.component_name,
                }));

                // 3.3 Crear objeto MenuWithPermission
                return {
                    uuid: menuData.uuid,
                    name: menuData.name,
                    description: menuData.description,
                    icon: menuData.icon,
                    path: menuData.path,
                    orden: menuData.sort_order,
                    active: menuData.active === 1,
                    assigned: menuData.assigned === 1,
                    is_navegable: menuData.is_navegable,
                    component_name: menuData.component_name,
                    feature_name: menuData.feature_name,
                    submenus: submenus
                };
            }));

            // 4. Crear el objeto RoleWithPermissions
            return {
                uuid: role.uuid,
                name: role.name,
                description: role.description,
                active: role.active === 1,
                availablePermissions: {
                    menus: menusWithPermissions
                }
            };
        } catch (error) {
            console.error(`Error getting permissions for role ${roleId}:`, error);
            return null;
        }
    }

    async assignMenuToRole(roleId: string, menuId: number): Promise<boolean> {
        try {
            // Verificar si el rol existe
            const roleResult = await query("SELECT id FROM roles WHERE uuid = ?", [roleId]);

            if (!roleResult || roleResult.length === 0) {
                throw new Error(`Role with UUID ${roleId} not found`);
            }

            const roleId_numeric = roleResult[0].id;

            // Verificar si el menú existe
            const menuExists = await query("SELECT id FROM menus WHERE uuid = ? AND deleted = 0", [menuId]);

            if (!menuExists || menuExists.length === 0) {
                throw new Error(`Menu with ID ${menuId} not found`);
            }

            const menuId_numeric = menuExists[0].id;

            const uuid = uuidv4();

            await query(
                "INSERT INTO role_menu (uuid, id_role, id_menu) VALUES (?, ?, ?)",
                [uuid, roleId_numeric, menuId_numeric]
            );
    
            return true;
        } catch (error) {
            console.error(`Error assigning menu ${menuId} to role ${roleId}:`, error);
            return false;
        }
    }

    async assignSubmenuToRole(roleId: string, submenuId: number): Promise<boolean> {
        try {
            // Verificar si el rol existe
            const roleResult = await query("SELECT id FROM roles WHERE uuid = ?", [roleId]);

            if (!roleResult || roleResult.length === 0) {
                throw new Error(`Role with UUID ${roleId} not found`);
            }

            const roleId_numeric = roleResult[0].id;

            // Verificar si el submenú existe
            const submenuExists = await query("SELECT id FROM submenus WHERE uuid = ? AND deleted = 0", [submenuId]);

            if (!submenuExists || submenuExists.length === 0) {
                throw new Error(`Submenu with UUID ${submenuId} not found`);
            }

            const submenu_id = submenuExists[0].id;

            // Verificar si ya existe la relación
            const existingRelation = await query(
                "SELECT id FROM role_submenu WHERE id_role = ? AND id_submenu = ?",
                [roleId_numeric, submenu_id]
            );

            if (existingRelation && existingRelation.length > 0) {
                return true;
            } else {
                // Crear la relación
                const uuid = uuidv4();
                await query(
                    "INSERT INTO role_submenu (uuid, id_role, id_submenu) VALUES (?, ?, ?)",
                    [uuid, roleId_numeric, submenu_id]
                );
            }

            return true;
        } catch (error) {
            console.error(`Error assigning submenu ${submenuId} to role ${roleId}:`, error);
            return false;
        }
    }

    async removeMenuFromRole(roleId: string, menuId: string): Promise<boolean> {
        try {
            // Verificar si el rol existe
            const roleResult = await query("SELECT id FROM roles WHERE uuid = ?", [roleId]);

            if (!roleResult || roleResult.length === 0) {
                throw new Error(`Role with UUID ${roleId} not found`);
            }

            const roleId_numeric = roleResult[0].id;

            const menuResult = await query("SELECT id FROM menus WHERE uuid = ?", [menuId]);

            if (!menuResult || menuResult.length === 0) {
                throw new Error(`Menu with UUID ${menuId} not found`);
            }

            const menu_id = menuResult[0].id;

            // Desactivar la relación (soft delete)
            await query(
                "DELETE FROM role_menu WHERE id_role = ? AND id_menu = ?",
                [roleId_numeric, menu_id]
            );

            return true;
        } catch (error) {
            console.error(`Error removing menu ${menuId} from role ${roleId}:`, error);
            return false;
        }
    }

    async removeSubmenuFromRole(roleId: string, submenuId: string): Promise<boolean> {
        try {
            // Verificar si el rol existe
            const roleResult = await query("SELECT id FROM roles WHERE uuid = ?", [roleId]);

            if (!roleResult || roleResult.length === 0) {
                throw new Error(`Role with UUID ${roleId} not found`);
            }

            const roleId_numeric = roleResult[0].id;

            const submenuResult = await query("SELECT id FROM submenus WHERE uuid = ?", [submenuId]);

            if (!submenuResult || submenuResult.length === 0) {
                throw new Error(`Submenu with UUID ${submenuId} not found`);
            }

            const submenu_id = submenuResult[0].id;

            // Desactivar la relación (soft delete)
            await query(
                "DELETE FROM role_submenu WHERE id_role = ? AND id_submenu = ?",
                [roleId_numeric, submenu_id]
            );

            return true;
        } catch (error) {
            console.error(`Error removing submenu ${submenuId} from role ${roleId}:`, error);
            return false;
        }
    }
}