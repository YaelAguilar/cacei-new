import { RoleRepository } from "../data/repository/roleRepository";

export class AssignMenuToRoleUseCase {
    constructor(private repository: RoleRepository) {}

    async execute(roleId: string, menuId: string): Promise<boolean> {
        try {
            return await this.repository.assignMenuToRole(roleId, menuId);
        } catch (error) {
            console.error("Error en AssignMenuToRoleUseCase:", error);
            return false;
        }
    }
}