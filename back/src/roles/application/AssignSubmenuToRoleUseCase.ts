import { RoleRepository } from "../domain/interfaces/roleRepository";

export class AssignSubmenuToRoleUseCase {
    constructor(private readonly roleRepository: RoleRepository) {}

    async execute(roleId: string, submenuId: number) {
        try {
            return await this.roleRepository.assignSubmenuToRole(roleId, submenuId);
        } catch (error) {
            console.error("Error en AssignSubmenuToRoleUseCase:", error);
            throw error;
        }
    }
}