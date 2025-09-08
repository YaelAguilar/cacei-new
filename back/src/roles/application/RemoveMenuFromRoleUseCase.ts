import { RoleRepository } from "../domain/interfaces/roleRepository";

export class RemoveMenuFromRoleUseCase {
    constructor(private readonly roleRepository: RoleRepository) {}

    async execute(roleId: string, menuId: string) {
        try {
            return await this.roleRepository.removeMenuFromRole(roleId, menuId);
        } catch (error) {
            console.error("Error en RemoveMenuFromRoleUseCase:", error);
            throw error;
        }
    }
}