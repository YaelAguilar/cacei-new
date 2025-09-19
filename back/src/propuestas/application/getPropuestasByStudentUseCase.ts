import { PropuestaRepository } from "../domain/interfaces/propuestaRepository";
import { Propuesta } from "../domain/models/propuesta";

export class GetPropuestasByStudentUseCase {
    constructor(private readonly propuestaRepository: PropuestaRepository) {}

    async run(studentId: number): Promise<Propuesta[] | null> {
        try {
            return await this.propuestaRepository.getPropuestasByStudent(studentId);
        } catch (error) {
            console.error("Error in GetPropuestasByStudentUseCase:", error);
            throw error;
        }
    }
}