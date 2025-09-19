// src/propuestas-comentarios/application/updateCommentUseCase.ts
import { CommentRepository, CommentUpdateData } from "../domain/interfaces/commentRepository";
import { ProposalComment } from "../domain/models/proposalComment";

export class UpdateCommentUseCase {
    constructor(private readonly commentRepository: CommentRepository) {}

    async run(
        uuid: string,
        updateData: {
            commentText?: string;
            voteStatus?: 'ACEPTADO' | 'RECHAZADO' | 'ACTUALIZA';
        }
    ): Promise<ProposalComment | null> {
        try {
            // Validar que el comentario existe
            const existingComment = await this.commentRepository.getComment(uuid);
            if (!existingComment) {
                throw new Error("Comentario no encontrado");
            }

            // Validaciones de negocio
            this.validateUpdateData(updateData);

            // Preparar datos para actualización
            const commentUpdateData: CommentUpdateData = {};

            if (updateData.commentText !== undefined) {
                commentUpdateData.commentText = updateData.commentText.trim();
            }

            if (updateData.voteStatus !== undefined) {
                commentUpdateData.voteStatus = updateData.voteStatus;
            }

            // Verificar que haya al menos un campo para actualizar
            if (Object.keys(commentUpdateData).length === 0) {
                throw new Error("No hay campos para actualizar");
            }

            return await this.commentRepository.updateComment(uuid, commentUpdateData);
        } catch (error) {
            console.error("Error in UpdateCommentUseCase:", error);
            throw error;
        }
    }

    private validateUpdateData(updateData: any): void {
        if (updateData.commentText !== undefined) {
            if (!updateData.commentText || !updateData.commentText.trim()) {
                throw new Error("El texto del comentario no puede estar vacío");
            }
            if (updateData.commentText.trim().length < 10) {
                throw new Error("El comentario debe tener al menos 10 caracteres");
            }
        }

        if (updateData.voteStatus !== undefined) {
            const validVotes = ['ACEPTADO', 'RECHAZADO', 'ACTUALIZA'];
            if (!validVotes.includes(updateData.voteStatus)) {
                throw new Error("El estado de votación debe ser ACEPTADO, RECHAZADO o ACTUALIZA");
            }
        }
    }
}