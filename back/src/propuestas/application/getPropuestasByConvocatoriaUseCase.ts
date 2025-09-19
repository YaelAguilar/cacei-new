import { PropuestaRepository } from "../domain/interfaces/propuestaRepository";
import { Propuesta } from "../domain/models/propuesta";

// src/propuestas/application/getPropuestasByConvocatoriaUseCase.ts
export class GetPropuestasByConvocatoriaUseCase {
    constructor(private readonly propuestaRepository: PropuestaRepository) {}

    async run(convocatoriaId: number): Promise<Propuesta[] | null> {
        try {
            return await this.propuestaRepository.getPropuestasByConvocatoria(convocatoriaId);
        } catch (error) {
            console.error("Error in GetPropuestasByConvocatoriaUseCase:", error);
            throw error;
        }
    }
}
