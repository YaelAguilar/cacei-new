// src/features/propuestas-comentarios/domain/ApproveProposalUseCase.ts
import { CommentRepository } from "../data/repository/CommentRepository";

export class ApproveProposalUseCase {
    constructor(private repository: CommentRepository) {}

    async execute(proposalId: string): Promise<boolean> {
        try {
            if (!proposalId || proposalId.trim() === '') {
                throw new Error("El ID de la propuesta es obligatorio");
            }

            return await this.repository.approveProposal(proposalId);
        } catch (error) {
            console.error("Error en ApproveProposalUseCase:", error);
            throw error;
        }
    }
}