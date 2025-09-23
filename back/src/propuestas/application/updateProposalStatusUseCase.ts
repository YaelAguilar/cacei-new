// src/propuestas/application/updateProposalStatusUseCase.ts
import { PropuestaRepository } from "../domain/interfaces/propuestaRepository";
import { Propuesta, ProposalStatus } from "../domain/models/propuesta";

export class UpdateProposalStatusUseCase {
    constructor(private readonly propuestaRepository: PropuestaRepository) {}

    async run(uuid: string, status: ProposalStatus, userUpdate?: number): Promise<Propuesta | null> {
        try {
            // Validar que el estatus sea válido
            const validStatuses: ProposalStatus[] = ['PENDIENTE', 'APROBADO', 'RECHAZADO', 'ACTUALIZAR'];
            if (!validStatuses.includes(status)) {
                throw new Error("Estatus de propuesta inválido");
            }

            // Verificar que la propuesta existe
            const propuestaExistente = await this.propuestaRepository.getPropuesta(uuid);
            if (!propuestaExistente) {
                throw new Error("Propuesta no encontrada");
            }

            // Actualizar el estatus
            return await this.propuestaRepository.updateProposalStatus(uuid, status, userUpdate);
        } catch (error) {
            console.error("Error in UpdateProposalStatusUseCase:", error);
            throw error;
        }
    }
}