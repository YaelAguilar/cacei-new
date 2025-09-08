import { RoleRepository } from "../domain/interfaces/roleRepository";

export class RemoveSubmenuFromRoleUseCase {
    constructor(private readonly roleRepository: RoleRepository) {}

    async execute(roleId: string, submenuId: string) {
        try {
            return await this.roleRepository.removeSubmenuFromRole(roleId, submenuId);
        } catch (error) {
            console.error("Error en RemoveSubmenuFromRoleUseCase:", error);
            throw error;
        }
    }
}