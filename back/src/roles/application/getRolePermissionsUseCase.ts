import { RoleRepository } from "../domain/interfaces/roleRepository";
import { RoleWithPermissions } from "../domain/models/roleWithPermissions";

export class GetRolePermissionsUseCase {
    constructor(private readonly roleRepository: RoleRepository) {}

    async execute(roleId: string): Promise<RoleWithPermissions | null> {
        try {
            // Validar que el roleId sea un UUID válido
            if (!roleId || typeof roleId !== 'string') {
                throw new Error("Invalid role ID");
            }
            
            // Llamar al repositorio para obtener los permisos del rol
            const rolePermissions = await this.roleRepository.getRolePermissions(roleId);
            
            if (!rolePermissions) {
                console.error(`No permissions found for role ${roleId}`);
                return null;
            }
            
            return rolePermissions;
        } catch (error) {
            console.error("Error in GetRolePermissionsUseCase:", error);
            throw error;
        }
    }
}