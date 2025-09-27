// src/propuestas-comentarios/application/rejectProposalUseCase.ts
import { CommentRepository } from "../domain/interfaces/commentRepository";

export class RejectProposalUseCase {
    constructor(private readonly commentRepository: CommentRepository) {}

    async run(
        proposalId: string,
        tutorId: number,
        tutorName: string,
        tutorEmail: string,
        comment: string = ''
    ): Promise<boolean> {
        try {
            console.log(`🚫 RejectProposalUseCase iniciado para propuesta ${proposalId}`);
            
            const rejected = await this.commentRepository.rejectEntireProposal(
                proposalId,
                tutorId,
                tutorName,
                tutorEmail,
                comment.trim()
            );

            console.log(`📋 Rechazo resultado: ${rejected ? 'exitoso' : 'falló'}`);
            return rejected;
        } catch (error) {
            console.error("❌ Error in RejectProposalUseCase:", error);
            throw error;
        }
    }
}


