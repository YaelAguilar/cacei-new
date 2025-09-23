// src/propuestas/application/getPropuestasByStatusUseCase.ts
import { PropuestaRepository } from "../domain/interfaces/propuestaRepository";
import { Propuesta, ProposalStatus } from "../domain/models/propuesta";

export class GetPropuestasByStatusUseCase {
    constructor(private readonly propuestaRepository: PropuestaRepository) {}

    async run(status: ProposalStatus): Promise<Propuesta[] | null> {
        try {
            // Validar que el estatus sea válido
            const validStatuses: ProposalStatus[] = ['PENDIENTE', 'APROBADO', 'RECHAZADO', 'ACTUALIZAR'];
            if (!validStatuses.includes(status)) {
                throw new Error("Estatus de propuesta inválido");
            }

            return await this.propuestaRepository.getPropuestasByStatus(status);
        } catch (error) {
            console.error("Error in GetPropuestasByStatusUseCase:", error);
            throw error;
        }
    }
}