// src/features/propuestas-comentarios/domain/UpdateCommentUseCase.ts
import { CommentRepository } from "../data/repository/CommentRepository";
import { ProposalComment } from "../data/models/ProposalComment";
import { UpdateCommentRequest } from "../data/models/ProposalCommentDTO";

export class UpdateCommentUseCase {
    constructor(private repository: CommentRepository) {}

    async execute(uuid: string, data: UpdateCommentRequest): Promise<ProposalComment> {
        try {
            if (!uuid) {
                throw new Error("El UUID del comentario es obligatorio");
            }

            if (data.commentText && data.commentText.trim().length < 10) {
                throw new Error("El comentario debe tener al menos 10 caracteres");
            }

            return await this.repository.updateComment(uuid, data);
        } catch (error) {
            console.error("Error en UpdateCommentUseCase:", error);
            throw error;
        }
    }
}