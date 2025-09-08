import { Role } from "../models/Role";
import {
    RoleDTO,
    PaginatedRoleResponse,
    mapRoleDTOToRole,
    JsonApiResponse
} from "../models/RoleDTO";
import { RolePermissions } from "../models/RolePermissions";
import { RolePermissionsResponseDTO, mapRolePermissionsDTOToRolePermissions } from "../models/RolePermissionsDTO";
import ApiClient from "../../../../core/API/ApiClient";

/**
 * Repositorio para gestionar las operaciones con roles en la API
 * Utiliza el cliente API centralizado para todas las peticiones
 */
export class RoleRepository {
    /**
     * Crear un nuevo rol
     * @param role Datos del rol a crear
     * @returns Role con los datos creados o null si hay error
     */
    async create(role: Role): Promise<RoleDTO | null> {
        try {
            // Utilizamos el cliente API centralizado con formato JSON:API
            const response = await ApiClient.post('/roles', {
                data: {
                    type: 'role',
                    attributes: {
                        name: role.name,
                        description: role.description
                    }
                }
            });

            // La respuesta ya está en formato JSON:API
            const roleDTO: RoleDTO = response.data.data;

            return roleDTO;
        } catch (error) {
            console.error("Error al crear el rol:", error);
            return null;
        }
    }

    /**
     * Obtener todos los roles con paginación
     * @param page Número de página
     * @param limit Límite de elementos por página
     * @param fields Campos específicos a solicitar (opcional)
     * @returns Objeto con paginación y datos, o null si hay error
     */
    async getAll(page: number = 1, limit: number = 30, fields?: string[]): Promise<{
        pagination: { currentPage: number; limit: number; total: number; },
        data: RoleDTO[]
    } | null> {
        try {
            let url = `/roles?page=${page}&limit=${limit}`;

            // Añadir campos específicos si se solicitan
            if (fields && fields.length > 0) {
                url += `&fields=${fields.join(',')}`;
            }

            const response = await ApiClient.get<PaginatedRoleResponse>(url);

            return {
                pagination: response.data.meta.pagination,
                data: response.data.data
            };
        } catch (error) {
            console.error("Error al obtener roles:", error);
            return null;
        }
    }

    /**
     * Obtener un rol por su UUID
     * @param uuid UUID del rol a buscar
     * @param fields Campos específicos a solicitar (opcional)
     * @returns Role con los datos o null si no se encuentra o hay error
     */
    async getByUuid(uuid: string, fields?: string[]): Promise<Role | null> {
        try {
            let url = `/roles/${uuid}`;

            // Añadir campos específicos si se solicitan
            if (fields && fields.length > 0) {
                url += `?fields=${fields.join(',')}`;
            }

            const response = await ApiClient.get<JsonApiResponse<RoleDTO>>(url);
            const roleDTO: RoleDTO = response.data.data;
            return mapRoleDTOToRole(roleDTO);
        } catch (error) {
            console.error(`Error al obtener el rol con UUID ${uuid}:`, error);
            return null;
        }
    }

    async update(uuid: string, role: Partial<Role>): Promise<Role | null> {
        try {
            // Definimos el tipo correcto para attributes
            const updateData = {
                data: {
                    type: 'role',
                    id: uuid,
                    attributes: {} as Record<string, any> // Esto permite agregar propiedades dinámicamente
                }
            };

            if (role.name !== undefined) updateData.data.attributes.name = role.name;
            if (role.description !== undefined) updateData.data.attributes.description = role.description;

            const response = await ApiClient.put<JsonApiResponse<RoleDTO>>(`/roles/${uuid}`, updateData);
            const roleDTO: RoleDTO = response.data.data;
            return mapRoleDTOToRole(roleDTO);
        } catch (error) {
            console.error(`Error al actualizar el rol con UUID ${uuid}:`, error);
            return null;
        }
    }

    /**
     * Desactivar un rol (eliminación lógica)
     * @param uuid UUID del rol a desactivar
     * @returns true si se desactivó correctamente, false si hubo error
     */
    async delete(uuid: string): Promise<boolean> {
        try {
            await ApiClient.delete(`/roles/${uuid}`);
            return true;
        } catch (error) {
            console.error(`Error al desactivar el rol con UUID ${uuid}:`, error);
            return false;
        }
    }

     /**
     * Obtiene todos los permisos disponibles para un rol
     * @param roleId UUID del rol
     * @returns Permisos disponibles y asignados para el rol
     */
    async getRolePermissions(roleId: string): Promise<RolePermissions | null> {
        try {
            // Obtener la respuesta de la API
            const response = await ApiClient.get<RolePermissionsResponseDTO>(`/roles/${roleId}/permissions`);
            
            // Verificar si tenemos una respuesta válida
            if (!response.data || !response.data.data) {
                throw new Error('Formato de respuesta inválido');
            }
            
            // Mapear la respuesta al modelo RolePermissions
            return mapRolePermissionsDTOToRolePermissions(response.data);
        } catch (error) {
            console.error(`Error al obtener permisos del rol ${roleId}:`, error);
            return null;
        }
    }


    /**
     * Asigna un menú a un rol
     * @param roleId UUID del rol
     * @param menuId ID del menú
     * @returns true si se asignó correctamente
     */
    async assignMenuToRole(roleId: string, menuId: string): Promise<boolean> {
        try {
            await ApiClient.post(`/roles/${roleId}/menus`, {
                menu_id: menuId
            });
            return true;
        } catch (error) {
            console.error(`Error al asignar menú ${menuId} al rol ${roleId}:`, error);
            return false;
        }
    }

    /**
     * Asigna un submenú a un rol
     * @param roleId UUID del rol
     * @param submenuId ID del submenú
     * @returns true si se asignó correctamente
     */
    async assignSubmenuToRole(roleId: string, submenuId: string): Promise<boolean> {
        try {
            await ApiClient.post(`/roles/${roleId}/submenus`, {
                submenu_id: submenuId
            });
            return true;

        } catch (error) {
            console.error(`Error al asignar submenú ${submenuId} al rol ${roleId}:`, error);
            return false;
        }
    }

    /**
     * Elimina un menú de un rol
     * @param roleId UUID del rol
     * @param menuId ID del menú
     * @returns true si se eliminó correctamente
     */
    async removeMenuFromRole(roleId: string, menuId: string): Promise<boolean> {
        try {
            await ApiClient.delete(`/roles/${roleId}/menus/${menuId}`);
            return true;
        } catch (error) {
            console.error(`Error al eliminar menú ${menuId} del rol ${roleId}:`, error);
            return false;
        }
    }

    /**
     * Elimina un submenú de un rol
     * @param roleId UUID del rol
     * @param submenuId ID del submenú
     * @returns true si se eliminó correctamente
     */
    async removeSubmenuFromRole(roleId: string, submenuId: string): Promise<boolean> {
        try {
            await ApiClient.delete(`/roles/${roleId}/submenus/${submenuId}`);
            return true;
        } catch (error) {
            console.error(`Error al eliminar submenú ${submenuId} del rol ${roleId}:`, error);
            return false;
        }
    }

}