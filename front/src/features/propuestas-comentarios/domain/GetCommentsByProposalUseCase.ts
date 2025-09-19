// src/features/propuestas-comentarios/domain/GetCommentsByProposalUseCase.ts
import { CommentRepository } from "../data/repository/CommentRepository";
import { ProposalComment } from "../data/models/ProposalComment";

export class GetCommentsByProposalUseCase {
    constructor(private repository: CommentRepository) {}

    async execute(proposalId: number): Promise<ProposalComment[]> {
        try {
            return await this.repository.getCommentsByProposal(proposalId);
        } catch (error) {
            console.error("Error en GetCommentsByProposalUseCase:", error);
            throw error;
        }
    }
}