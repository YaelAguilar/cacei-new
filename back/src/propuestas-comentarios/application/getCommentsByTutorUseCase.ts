// src/propuestas-comentarios/application/getCommentsByTutorUseCase.ts
import { CommentRepository } from "../domain/interfaces/commentRepository";
import { ProposalComment } from "../domain/models/proposalComment";

export class GetCommentsByTutorUseCase {
    constructor(private readonly commentRepository: CommentRepository) {}

    async run(tutorId: number): Promise<ProposalComment[] | null> {
        try {
            return await this.commentRepository.getCommentsByTutor(tutorId);
        } catch (error) {
            console.error("Error in GetCommentsByTutorUseCase:", error);
            throw error;
        }
    }
}