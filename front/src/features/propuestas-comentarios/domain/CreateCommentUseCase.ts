// src/features/propuestas-comentarios/domain/CreateCommentUseCase.ts
import { CommentRepository } from "../data/repository/CommentRepository";
import { ProposalComment } from "../data/models/ProposalComment";
import { CreateCommentRequest } from "../data/models/ProposalCommentDTO";

export class CreateCommentUseCase {
    constructor(private repository: CommentRepository) {}

    async execute(data: CreateCommentRequest): Promise<ProposalComment> {
        try {
            // MEJORAR el mensaje de error
            console.log('🔍 CreateCommentUseCase - data recibida:', data); // ← AGREGAR

            if (!data.proposalId || data.proposalId.trim() === '') {
                console.error('❌ ID de propuesta inválido:', data.proposalId); // ← AGREGAR
                throw new Error(`El ID de la propuesta es obligatorio y debe ser un número válido. Recibido: ${data.proposalId}`);
            }

            if (!data.commentText || data.commentText.trim().length < 10) {
                throw new Error("El comentario debe tener al menos 10 caracteres");
            }

            if (!['ACEPTADO', 'RECHAZADO', 'ACTUALIZA'].includes(data.voteStatus)) {
                throw new Error("Estado de votación inválido");
            }

            return await this.repository.createComment(data);
        } catch (error) {
            console.error("Error en CreateCommentUseCase:", error);
            throw error;
        }
    }
}