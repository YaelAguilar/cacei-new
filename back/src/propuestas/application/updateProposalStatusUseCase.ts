// src/propuestas/application/updateProposalStatusUseCase.ts
import { PropuestaRepository } from "../domain/interfaces/propuestaRepository";

export interface UpdateProposalStatusParams {
    proposalId: string;
    newStatus: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO' | 'ACTUALIZAR';
}

export class UpdateProposalStatusUseCase {
    constructor(private readonly propuestaRepository: PropuestaRepository) {}

    async execute(params: UpdateProposalStatusParams): Promise<boolean> {
        try {
            console.log(`🔄 Actualizando estado de propuesta ${params.proposalId} a ${params.newStatus}`);
            
            const success = await this.propuestaRepository.updateProposalStatus(
                params.proposalId, 
                params.newStatus
            );
            
            if (success) {
                console.log(`✅ Estado de propuesta ${params.proposalId} actualizado exitosamente a ${params.newStatus}`);
            } else {
                console.log(`❌ Error al actualizar estado de propuesta ${params.proposalId}`);
            }
            
            return success;
        } catch (error) {
            console.error("❌ Error in UpdateProposalStatusUseCase:", error);
            throw error;
        }
    }
}