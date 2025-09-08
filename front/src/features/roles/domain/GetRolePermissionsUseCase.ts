import { RoleRepository } from "../data/repository/roleRepository";
import { RolePermissions } from "../data/models/RolePermissions";

export class GetRolePermissionsUseCase {
    constructor(private repository: RoleRepository) {}

    async execute(roleId: string): Promise<RolePermissions | null> {
        try {
            return await this.repository.getRolePermissions(roleId);
        } catch (error) {
            console.error("Error en GetRolePermissionsUseCase:", error);
            return null;
        }
    }
}