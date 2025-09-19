import { PropuestaRepository } from "../domain/interfaces/propuestaRepository";
import { Propuesta } from "../domain/models/propuesta";

// src/propuestas/application/getPropuestaUseCase.ts
export class GetPropuestaUseCase {
    constructor(private readonly propuestaRepository: PropuestaRepository) {}

    async run(uuid: string): Promise<Propuesta | null> {
        try {
            return await this.propuestaRepository.getPropuesta(uuid);
        } catch (error) {
            console.error("Error in GetPropuestaUseCase:", error);
            throw error;
        }
    }
}