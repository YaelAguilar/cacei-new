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
            
            // ✅ NUEVO: Verificar si el tutor ya tiene votos finales contradictorios
            const existingFinalVotes = await this.commentRepository.hasTutorVotedFinal(proposalId, tutorId);
            
            if (existingFinalVotes.hasVoted) {
                const existingStatus = existingFinalVotes.voteStatus;
                
                if (existingStatus === 'ACEPTADO') {
                    throw new Error(
                        `No se puede rechazar la propuesta porque ya existe un voto final "ACEPTADO" ` +
                        `de este tutor para esta propuesta. Un tutor solo puede tener un voto final por propuesta.`
                    );
                }
                
                if (existingStatus === 'RECHAZADO') {
                    throw new Error(
                        `Ya existe un voto final "RECHAZADO" de este tutor para esta propuesta. ` +
                        `No se permiten votos finales duplicados.`
                    );
                }
            }
            
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


