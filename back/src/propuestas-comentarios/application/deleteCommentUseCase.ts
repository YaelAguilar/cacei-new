// src/propuestas-comentarios/application/deleteCommentUseCase.ts
import { CommentRepository } from "../domain/interfaces/commentRepository";

export class DeleteCommentUseCase {
    constructor(private readonly commentRepository: CommentRepository) {}

    async run(uuid: string): Promise<boolean> {
        try {
            // Verificar que el comentario existe
            const existingComment = await this.commentRepository.getComment(uuid);
            if (!existingComment) {
                throw new Error("Comentario no encontrado");
            }

            return await this.commentRepository.deleteComment(uuid);
        } catch (error) {
            console.error("Error in DeleteCommentUseCase:", error);
            throw error;
        }
    }
}