import { RoleRepository } from "../data/repository/roleRepository";

export class RemoveSubmenuFromRoleUseCase {
    constructor(private repository: RoleRepository) {}

    async execute(roleId: string, menuId: string): Promise<boolean> {
        try {
            return await this.repository.removeSubmenuFromRole(roleId, menuId);
        } catch (error) {
            console.error("Error en RemoveSubmenuFromRoleUseCase:", error);
            return false;
        }
    }
}