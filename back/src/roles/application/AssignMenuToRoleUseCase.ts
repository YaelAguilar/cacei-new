import { RoleRepository } from "../domain/interfaces/roleRepository";

export class AssignMenuToRoleUseCase {
    constructor(private readonly roleRepository: RoleRepository) {}

    async execute(roleId: string, menuId: number) {
        try {
            return await this.roleRepository.assignMenuToRole(roleId, menuId);
        } catch (error) {
            console.error("Error en AssignMenuToRoleUseCase:", error);
            throw error;
        }
    }
}