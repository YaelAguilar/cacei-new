// src/propuestas-comentarios/application/checkTutorFinalVoteUseCase.ts
import { CommentRepository } from "../domain/interfaces/commentRepository";

export class CheckTutorFinalVoteUseCase {
    constructor(private readonly commentRepository: CommentRepository) {}

    async run(
        proposalId: string,
        tutorId: number
    ): Promise<{
        hasVoted: boolean;
        voteStatus?: 'ACEPTADO' | 'RECHAZADO';
        commentText?: string;
        createdAt?: Date;
        tutorName?: string;
        tutorEmail?: string;
    }> {
        try {
            if (!proposalId || proposalId.trim() === '') {
                throw new Error("El ID de la propuesta es obligatorio");
            }

            if (!tutorId) {
                throw new Error("El ID del tutor es obligatorio");
            }

            return await this.commentRepository.hasTutorVotedFinal(proposalId, tutorId);

        } catch (error) {
            console.error("Error in CheckTutorFinalVoteUseCase:", error);
            throw error;
        }
    }
}