import { ConvocatoriaRepository } from "../domain/interfaces/convocatoriaRepository";

export class DeactivateExpiredConvocatoriasUseCase {
    constructor(private readonly convocatoriaRepository: ConvocatoriaRepository) {}

    async run(): Promise<void> {
        try {
            await this.convocatoriaRepository.deactivateExpiredConvocatorias();
        } catch (error) {
            console.error("Error in DeactivateExpiredConvocatoriasUseCase:", error);
            throw error;
        }
    }
}