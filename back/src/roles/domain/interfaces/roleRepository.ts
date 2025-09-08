import { PaginationResponse } from "../../../utils/paginationResponse";
import { Role } from "../models/role";
import { RoleWithPermissions } from "../models/roleWithPermissions";

export interface RoleRepository {

    //Metodos para roles
    createRole(
        name: string,
        description: string
    ): Promise<Role | null>;

    getRoles(
        fields: string[] | null,
        page: number,
        limit: number
    ): Promise<PaginationResponse<Role> | null>

    getRole(
        uuid: string,
        fields: string[] | null
    ): Promise<Role | null>;

    updateRol(
        uuid: string,
        updatedData: Partial<Role>
    ): Promise<Role | null>;

    deleteRole(uuid: string):Promise<Role | null>;

    //Metodos para asignaciones de menus y submenus
    
    getRolePermissions(roleId: string): Promise<RoleWithPermissions | null>;
    assignMenuToRole(roleId: string, menuId: number): Promise<boolean>;
    assignSubmenuToRole(roleId: string, submenuId: number): Promise<boolean>;
    removeMenuFromRole(roleId: string, menuId: string): Promise<boolean>;
    removeSubmenuFromRole(roleId: string, submenuId: string): Promise<boolean>;
}