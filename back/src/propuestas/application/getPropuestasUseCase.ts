// src/propuestas/application/getPropuestasUseCase.ts
import { PropuestaRepository } from "../domain/interfaces/propuestaRepository";
import { Propuesta } from "../domain/models/propuesta";

export class GetPropuestasUseCase {
    constructor(private readonly propuestaRepository: PropuestaRepository) {}

    async run(): Promise<Propuesta[] | null> {
        try {
            return await this.propuestaRepository.getPropuestas();
        } catch (error) {
            console.error("Error in GetPropuestasUseCase:", error);
            throw error;
        }
    }
}
