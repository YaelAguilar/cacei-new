import { RoleRepository } from "../domain/interfaces/roleRepository";
import { Role } from "../domain/models/role";

export class CreateRoleUseCase {
    constructor(private readonly roleRepository: RoleRepository) {}

    async run(name: string, description: string): Promise<Role | null> {
        try {
            const role = await this.roleRepository.createRole(name, description);
            return role;
        } catch (error) {
            console.error("Error in CreateRoleUseCase:", error);
            return null;
        }
    }
}