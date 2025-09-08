// domain/CreateRoleUseCase.ts
import { RoleRepository } from "../data/repository/roleRepository";
import { RoleDTO } from "../data/models/RoleDTO";

/**
 * Caso de uso para crear un nuevo rol
 * Sigue el principio de responsabilidad única
 */
export class CreateRoleUseCase {
    constructor(private repository: RoleRepository) {}

    /**
     * Ejecuta el caso de uso para crear un nuevo rol
     * @param name Nombre del rol
     * @param description Descripción del rol
     * @returns RoleDTO con el rol creado o null si hay error
     */
    async execute(name: string, description: string): Promise<RoleDTO | null> {
        try {
            // Validar los datos
            if (!name) {
                throw new Error("El nombre del rol es obligatorio");
            }

            // Crear un rol temporal para pasar al repositorio
            const tempRole = {
                name,
                description: description || ""
            };

            // Llamar al repositorio para crear el rol
            const result = await this.repository.create(tempRole as any);
            return result;
        } catch (error) {
            console.error("Error en CreateRoleUseCase:", error);
            return null;
        }
    }
}