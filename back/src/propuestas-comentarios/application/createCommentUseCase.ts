// src/propuestas-comentarios/application/createCommentUseCase.ts
import { CommentRepository, CommentCreateData } from "../domain/interfaces/commentRepository";
import { ProposalComment } from "../domain/models/proposalComment";

export class CreateCommentUseCase {
    constructor(private readonly commentRepository: CommentRepository) {}

    async run(
        proposalId: string | number,  // ⭐ Cambiar a string | number
        tutorId: number,
        sectionName: string,
        subsectionName: string,
        commentText: string,
        voteStatus: 'ACEPTADO' | 'RECHAZADO' | 'ACTUALIZA'
    ): Promise<ProposalComment | null> {
        try {
            // Validaciones de negocio
            this.validateBusinessRules(
                sectionName,
                subsectionName,
                commentText,
                voteStatus
            );

            // Verificar si ya existe un comentario del tutor en esta subsección
            const existingComment = await this.commentRepository.checkExistingComment(
                typeof proposalId === 'string' ? parseInt(proposalId) : proposalId,
                tutorId,
                subsectionName
            );

            if (existingComment) {
                throw new Error(
                    `Ya existe un comentario de este tutor en la subsección "${subsectionName}". ` +
                    `Use actualización para modificarlo.`
                );
            }

            // Crear el comentario
            const commentData: CommentCreateData = {
                proposalId: typeof proposalId === 'string' ? proposalId : proposalId.toString(),  // ⭐ Asegurar que sea string
                tutorId,
                sectionName: sectionName.trim(),
                subsectionName: subsectionName.trim(),
                commentText: commentText.trim(),
                voteStatus
            };

            return await this.commentRepository.createComment(commentData);
        } catch (error) {
            console.error("Error in CreateCommentUseCase:", error);
            throw error;
        }
    }

    private validateBusinessRules(
        sectionName: string,
        subsectionName: string,
        commentText: string,
        voteStatus: string
    ): void {
        if (!sectionName || !sectionName.trim()) {
            throw new Error("El nombre de la sección es obligatorio");
        }

        if (!subsectionName || !subsectionName.trim()) {
            throw new Error("El nombre de la subsección es obligatorio");
        }

        if (!commentText || !commentText.trim()) {
            throw new Error("El texto del comentario es obligatorio");
        }

        if (commentText.trim().length < 10) {
            throw new Error("El comentario debe tener al menos 10 caracteres");
        }

        const validVotes = ['ACEPTADO', 'RECHAZADO', 'ACTUALIZA'];
        if (!validVotes.includes(voteStatus)) {
            throw new Error("El estado de votación debe ser ACEPTADO, RECHAZADO o ACTUALIZA");
        }
    }
}