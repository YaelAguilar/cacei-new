// src/propuestas-comentarios/application/getCommentsByProposalUseCase.ts
import { CommentRepository } from "../domain/interfaces/commentRepository";
import { ProposalComment } from "../domain/models/proposalComment";

export class GetCommentsByProposalUseCase {
    constructor(private readonly commentRepository: CommentRepository) {}

    async run(proposalId: string): Promise<ProposalComment[] | null> {
        try {
            return await this.commentRepository.getCommentsByProposal(proposalId);
        } catch (error) {
            console.error("Error in GetCommentsByProposalUseCase:", error);
            throw error;
        }
    }
}