import { RoleRepository } from "../data/repository/roleRepository";

export class RemoveMenuFromRoleUseCase {
    constructor(private repository: RoleRepository) {}

    async execute(roleId: string, menuId: string): Promise<boolean> {
        try {
            return await this.repository.removeMenuFromRole(roleId, menuId);
        } catch (error) {
            console.error("Error en RemoveMenuFromRoleUseCase:", error);
            return false;
        }
    }
}