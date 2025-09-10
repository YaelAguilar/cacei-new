import { ConvocatoriaRepository } from "../domain/interfaces/convocatoriaRepository";

export class CheckActiveConvocatoriaUseCase {
    constructor(private readonly convocatoriaRepository: ConvocatoriaRepository) {}

    async run(): Promise<boolean> {
        try {
            return await this.convocatoriaRepository.hasActiveConvocatoria();
        } catch (error) {
            console.error("Error in CheckActiveConvocatoriaUseCase:", error);
            throw error;
        }
    }
}