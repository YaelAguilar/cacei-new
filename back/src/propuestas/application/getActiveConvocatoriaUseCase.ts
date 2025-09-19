import { PropuestaRepository } from "../domain/interfaces/propuestaRepository";

// src/propuestas/application/getActiveConvocatoriaUseCase.ts
export class GetActiveConvocatoriaUseCase {
    constructor(private readonly propuestaRepository: PropuestaRepository) {}

    async run(): Promise<{ id: number; uuid: string; nombre: string; pasantiasDisponibles: string[]; profesoresDisponibles: any[] } | null> {
        try {
            return await this.propuestaRepository.getActiveConvocatoria();
        } catch (error) {
            console.error("Error in GetActiveConvocatoriaUseCase:", error);
            throw error;
        }
    }
}