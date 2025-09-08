import { RoleRepository } from "../data/repository/roleRepository";

export class AssignSubmenuToRoleUseCase {
    constructor(private repository: RoleRepository) {}

    async execute(roleId: string, submenuId: string): Promise<boolean> {
        try {
            return await this.repository.assignSubmenuToRole(roleId, submenuId);
        } catch (error) {
            console.error("Error en AssignSubmenuToRoleUseCase:", error);
            return false;
        }
    }
}