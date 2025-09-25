// src/propuestas-comentarios/application/updateProposalUseCase.ts
import { CommentRepository } from "../domain/interfaces/commentRepository";

export class UpdateProposalUseCase {
    constructor(private readonly commentRepository: CommentRepository) {}

    async run(
        proposalId: string,
        tutorId: number,
        tutorName: string,
        tutorEmail: string
    ): Promise<boolean> {
        try {
            console.log(`🔄 UpdateProposalUseCase iniciado para propuesta ${proposalId}`);
            
            const updated = await this.commentRepository.updateEntireProposal(
                proposalId,
                tutorId,
                tutorName,
                tutorEmail
            );

            console.log(`📋 Actualización resultado: ${updated ? 'exitoso' : 'falló'}`);
            return updated;
        } catch (error) {
            console.error("❌ Error in UpdateProposalUseCase:", error);
            throw error;
        }
    }
}
