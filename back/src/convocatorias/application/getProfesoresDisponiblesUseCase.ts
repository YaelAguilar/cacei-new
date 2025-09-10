import { ConvocatoriaRepository } from "../domain/interfaces/convocatoriaRepository";
import { Profesor } from "../domain/models/profesor";

export class GetProfesoresDisponiblesUseCase {
    constructor(private readonly convocatoriaRepository: ConvocatoriaRepository) {}

    async run(): Promise<Profesor[] | null> {
        try {
            return await this.convocatoriaRepository.getProfesoresDisponibles();
        } catch (error) {
            console.error("Error in GetProfesoresDisponiblesUseCase:", error);
            throw error;
        }
    }
}