// src/features/propuestas-comentarios/domain/DeleteCommentUseCase.ts
import { CommentRepository } from "../data/repository/CommentRepository";

export class DeleteCommentUseCase {
    constructor(private repository: CommentRepository) {}

    async execute(uuid: string): Promise<boolean> {
        try {
            if (!uuid) {
                throw new Error("El UUID del comentario es obligatorio");
            }

            return await this.repository.deleteComment(uuid);
        } catch (error) {
            console.error("Error en DeleteCommentUseCase:", error);
            throw error;
        }
    }
}