import { ConvocatoriaRepository } from "../domain/interfaces/convocatoriaRepository";
import { Convocatoria } from "../domain/models/convocatoria";

export class GetConvocatoriaUseCase {
    constructor(private readonly convocatoriaRepository: ConvocatoriaRepository) {}

    async run(uuid: string): Promise<Convocatoria | null> {
        try {
            return await this.convocatoriaRepository.getConvocatoria(uuid);
        } catch (error) {
            console.error("Error in GetConvocatoriaUseCase:", error);
            throw error;
        }
    }
}