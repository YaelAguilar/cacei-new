// src/propuestas-comentarios/application/updateProposalStatusAfterCommentUseCase.ts
import { CalculateProposalStatusUseCase } from "../../propuestas/application/calculateProposalStatusUseCase";
import { PropuestaRepository } from "../../propuestas/domain/interfaces/propuestaRepository";
import { CommentRepository } from "../domain/interfaces/commentRepository";

export class UpdateProposalStatusAfterCommentUseCase {
    constructor(
        private readonly calculateProposalStatusUseCase: CalculateProposalStatusUseCase,
        private readonly propuestaRepository: PropuestaRepository,
        private readonly commentRepository: CommentRepository
    ) {}

    async run(proposalId: string): Promise<boolean> {
        try {
            console.log(`🔄 DEBUG: UpdateProposalStatusAfterCommentUseCase.run() iniciado para propuesta ${proposalId}`);
            
            // Calcular y actualizar el estado de la propuesta
            const statusUpdated = await this.calculateProposalStatusUseCase.updateProposalStatusIfNeeded(proposalId);
            
            console.log(`📊 DEBUG: updateProposalStatusIfNeeded() devolvió: ${statusUpdated}`);
            
            if (statusUpdated) {
                console.log(`✅ Estado de propuesta ${proposalId} actualizado exitosamente`);
            } else {
                console.log(`ℹ️ Estado de propuesta ${proposalId} no requirió actualización`);
            }

            return statusUpdated;
        } catch (error) {
            console.error("❌ DEBUG: Error updating proposal status after comment:", error);
            throw error;
        }
    }
}

