// src/propuestas-comentarios/application/checkTutorFinalVoteUseCase.ts
import { CommentRepository } from "../domain/interfaces/commentRepository";

export interface TutorFinalVoteResult {
    hasVoted: boolean;
    voteStatus?: 'ACEPTADO' | 'RECHAZADO';
    commentText?: string;
    createdAt?: Date;
    tutorName?: string;
    tutorEmail?: string;
}

export class CheckTutorFinalVoteUseCase {
    constructor(
        private readonly commentRepository: CommentRepository
    ) {}

    async execute(proposalId: string, tutorId: number): Promise<TutorFinalVoteResult> {
        try {
            console.log('🔍 CheckTutorFinalVoteUseCase ejecutándose:', { proposalId, tutorId });

            const result = await this.commentRepository.hasTutorVotedFinal(proposalId, tutorId);
            
            if (result.hasVoted && result.comment) {
                return {
                    hasVoted: true,
                    voteStatus: result.voteStatus,
                    commentText: result.comment.getCommentText(),
                    createdAt: result.comment.getCreatedAt(),
                    tutorName: result.comment.getTutorName(),
                    tutorEmail: result.comment.getTutorEmail()
                };
            }

            return { hasVoted: false };
        } catch (error) {
            console.error("Error in CheckTutorFinalVoteUseCase:", error);
            throw new Error(`Error al verificar voto final del tutor: ${error}`);
        }
    }
}

