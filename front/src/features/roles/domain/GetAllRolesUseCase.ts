// domain/GetAllRolesUseCase.ts
import { RoleRepository } from "../data/repository/roleRepository";
import { RoleDTO } from "../data/models/RoleDTO";

export class GetAllRolesUseCase {
    constructor(private repository: RoleRepository) {}

    async execute(
        page: number = 1, 
        limit: number = 30, 
        fields?: string[]
    ): Promise<{
        pagination: { currentPage: number; limit: number; total: number; },
        data: RoleDTO[]
    } | null> {
        try {
            // Validación básica
            const validPage = page < 1 ? 1 : page;
            const validLimit = limit < 1 ? 30 : limit;
            
            // Llamar al repositorio para obtener los roles
            const result = await this.repository.getAll(validPage, validLimit, fields);
            return result;
        } catch (error) {
            console.error("Error en GetAllRolesUseCase:", error);
            return null;
        }
    }
}