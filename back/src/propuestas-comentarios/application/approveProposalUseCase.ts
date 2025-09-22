// src/propuestas-comentarios/application/approveProposalUseCase.ts
import { CommentRepository } from "../domain/interfaces/commentRepository";

export class ApproveProposalUseCase {
    constructor(private readonly commentRepository: CommentRepository) {}

    async run(
        proposalId: string,
        tutorId: number,
        tutorName: string,
        tutorEmail: string
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

            return await this.commentRepository.approveEntireProposal(
                proposalId,
                tutorId,
                tutorName.trim(),
                tutorEmail.trim()
            );

        } catch (error) {
            console.error("Error in ApproveProposalUseCase:", error);
            throw error;
        }
    }
}