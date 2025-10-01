// src/propuestas-comentarios/application/approveProposalUseCase.ts
import { CommentRepository } from "../domain/interfaces/commentRepository";

export class ApproveProposalUseCase {
    constructor(private readonly commentRepository: CommentRepository) {}

    async run(
        proposalId: string,
        tutorId: number,
        tutorName: string,
        tutorEmail: string,
        comment: string = ''
    ): Promise<boolean> {
        try {
            if (!proposalId || proposalId.trim() === '') {
                throw new Error("El ID de la propuesta es obligatorio");
            }

            if (!tutorId) {
                throw new Error("El ID del tutor es obligatorio");
            }

            if (!tutorName || !tutorName.trim()) {
                throw new Error("El nombre del tutor es obligatorio");
            }

            if (!tutorEmail || !tutorEmail.trim()) {
                throw new Error("El email del tutor es obligatorio");
            }

            // ✅ NUEVO: Verificar si el tutor ya tiene votos finales contradictorios
            const existingFinalVotes = await this.commentRepository.hasTutorVotedFinal(proposalId, tutorId);
            
            if (existingFinalVotes.hasVoted) {
                const existingStatus = existingFinalVotes.voteStatus;
                
                if (existingStatus === 'RECHAZADO') {
                    throw new Error(
                        `No se puede aprobar la propuesta porque ya existe un voto final "RECHAZADO" ` +
                        `de este tutor para esta propuesta. Un tutor solo puede tener un voto final por propuesta.`
                    );
                }
                
                if (existingStatus === 'ACEPTADO') {
                    throw new Error(
                        `Ya existe un voto final "ACEPTADO" de este tutor para esta propuesta. ` +
                        `No se permiten votos finales duplicados.`
                    );
                }
            }

            return await this.commentRepository.approveEntireProposal(
                proposalId,
                tutorId,
                tutorName.trim(),
                tutorEmail.trim(),
                comment.trim()
            );

        } catch (error) {
            console.error("Error in ApproveProposalUseCase:", error);
            throw error;
        }
    }
}