// src/propuestas-comentarios/application/createCommentUseCase.ts
import { CommentRepository, CommentCreateData } from "../domain/interfaces/commentRepository";
import { ProposalComment } from "../domain/models/proposalComment";

export class CreateCommentUseCase {
    constructor(private readonly commentRepository: CommentRepository) {}

    async run(
        proposalId: string | number,
        tutorId: number,
        sectionName: string,
        subsectionName: string,
        commentText: string,
        voteStatus: 'ACEPTADO' | 'RECHAZADO' | 'ACTUALIZA'
    ): Promise<ProposalComment | null> {
        try {
            // MEJORAR el mensaje de error
            console.log('🔍 CreateCommentUseCase - data recibida:', { proposalId, tutorId, sectionName, subsectionName, commentText, voteStatus });

            if (!proposalId || proposalId.toString().trim() === '') {
                console.error('❌ ID de propuesta inválido:', proposalId);
                throw new Error(`El ID de la propuesta es obligatorio y debe ser un número válido. Recibido: ${proposalId}`);
            }

            // Validaciones de negocio
            this.validateBusinessRules(
                sectionName,
                subsectionName,
                commentText,
                voteStatus
            );

            // ✅ NUEVO: Verificar si ya existe un comentario del tutor en esta SECCIÓN (no subsección)
            const existingComment = await this.commentRepository.checkExistingCommentInSection(
                typeof proposalId === 'string' ? parseInt(proposalId) : proposalId,
                tutorId,
                sectionName
            );

            if (existingComment) {
                throw new Error(
                    `Ya existe un comentario de este tutor en la sección "${sectionName}". ` +
                    `Solo se permite un comentario por sección por tutor.`
                );
            }

            // Crear el comentario
            const commentData: CommentCreateData = {
                proposalId: typeof proposalId === 'string' ? proposalId : proposalId.toString(),
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