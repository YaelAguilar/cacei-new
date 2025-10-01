// src/propuestas-comentarios/application/updateCommentUseCase.ts
import { CommentRepository, CommentUpdateData } from "../domain/interfaces/commentRepository";
import { ProposalComment } from "../domain/models/proposalComment";
import { ValidateCommentEditUseCase } from "./validateCommentEditUseCase";
import { UpdateProposalStatusAfterCommentUseCase } from "./updateProposalStatusAfterCommentUseCase";
import { PropuestaRepository } from "../../propuestas/domain/interfaces/propuestaRepository";
import mysql from 'mysql2/promise';

export class UpdateCommentUseCase {
    constructor(
        private readonly commentRepository: CommentRepository,
        private readonly validateCommentEditUseCase: ValidateCommentEditUseCase,
        private readonly updateProposalStatusUseCase: UpdateProposalStatusAfterCommentUseCase,
        private readonly propuestaRepository: PropuestaRepository
    ) {}

    async run(
        uuid: string,
        updateData: {
            commentText?: string;
            voteStatus?: 'ACEPTADO' | 'RECHAZADO' | 'ACTUALIZA';
        },
        tutorId: number
    ): Promise<ProposalComment | null> {
        try {
            // Validar que el comentario existe
            const existingComment = await this.commentRepository.getComment(uuid);
            if (!existingComment) {
                throw new Error("Comentario no encontrado");
            }

            // ✅ NUEVO: Verificar que la propuesta no esté APROBADO o RECHAZADO
            await this.validateProposalStatus(existingComment.getProposalId());

            // ✅ NUEVO: Validar permisos de edición
            await this.validateCommentEditUseCase.run(uuid, tutorId);

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

            const updatedComment = await this.commentRepository.updateComment(uuid, commentUpdateData);
            
            // ✅ NUEVO: Actualizar automáticamente el estado de la propuesta
            if (updatedComment) {
                try {
                    await this.updateProposalStatusUseCase.run(updatedComment.getProposalId());
                } catch (statusError) {
                    console.error("Error updating proposal status after comment update:", statusError);
                    // No lanzamos el error para no afectar la actualización del comentario
                }
            }

            return updatedComment;
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
            // ✅ REGLAS DE NEGOCIO CORREGIDAS:
            // - ACEPTADO/RECHAZADO: Solo para propuesta completa (usar endpoints específicos)
            // - ACTUALIZA: Solo para secciones específicas (con comentario obligatorio)
            
            if (updateData.voteStatus === 'ACEPTADO' || updateData.voteStatus === 'RECHAZADO') {
                const error = new Error(
                    `Los votos "${updateData.voteStatus}" solo pueden aplicarse a la propuesta completa. ` +
                    `Para votar por secciones específicas, use "ACTUALIZA" y proporcione un comentario detallado. ` +
                    `Para aprobar/rechazar la propuesta completa, use los endpoints específicos de aprobación/rechazo.`
                );
                error.statusCode = 400;
                throw error;
            }

            if (updateData.voteStatus !== 'ACTUALIZA') {
                throw new Error("Para comentarios por sección, el estado de votación debe ser 'ACTUALIZA'");
            }
        }
    }

    /**
     * Valida que la propuesta no esté en estado APROBADO o RECHAZADO
     */
    private async validateProposalStatus(proposalId: string): Promise<void> {
        try {
            const proposal = await this.propuestaRepository.getPropuesta(proposalId);
            
            if (!proposal) {
                throw new Error("Propuesta no encontrada");
            }

            const currentStatus = proposal.getProposalStatus();
            
            if (currentStatus === 'APROBADO') {
                throw new Error(
                    "No se pueden editar comentarios en propuestas que ya han sido APROBADAS. " +
                    "La evaluación de esta propuesta ha sido cerrada."
                );
            }
            
            if (currentStatus === 'RECHAZADO') {
                throw new Error(
                    "No se pueden editar comentarios en propuestas que ya han sido RECHAZADAS. " +
                    "La evaluación de esta propuesta ha sido cerrada."
                );
            }
        } catch (error) {
            console.error("Error validating proposal status:", error);
            throw error;
        }
    }
}