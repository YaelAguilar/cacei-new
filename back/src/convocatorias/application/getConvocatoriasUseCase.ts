import { ConvocatoriaRepository } from "../domain/interfaces/convocatoriaRepository";
import { Convocatoria } from "../domain/models/convocatoria";

export class GetConvocatoriasUseCase {
    constructor(private readonly convocatoriaRepository: ConvocatoriaRepository) {}

    async run(): Promise<Convocatoria[] | null> {
        try {
            return await this.convocatoriaRepository.getConvocatorias();
        } catch (error) {
            console.error("Error in GetConvocatoriasUseCase:", error);
            throw error;
        }
    }
}