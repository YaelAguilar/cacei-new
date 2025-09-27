// src/propuestas-comentarios/application/validateCommentEditUseCase.ts
import { CommentRepository } from "../domain/interfaces/commentRepository";
import { PropuestaRepository } from "../../propuestas/domain/interfaces/propuestaRepository";

export class ValidateCommentEditUseCase {
    constructor(
        private readonly commentRepository: CommentRepository,
        private readonly propuestaRepository: PropuestaRepository
    ) {}

    async run(commentUuid: string, tutorId: number): Promise<void> {
        try {
            console.log('🔍 ValidateCommentEditUseCase iniciado:', { commentUuid, tutorId });

            // Obtener el comentario
            const comment = await this.commentRepository.getComment(commentUuid);
            if (!comment) {
                throw new Error("Comentario no encontrado");
            }

            // Verificar que el tutor es el propietario del comentario
            if (comment.getTutorId() !== tutorId) {
                throw new Error("No tienes permisos para editar este comentario");
            }

            // Verificar el estado de votación
            const voteStatus = comment.getVoteStatus();
            
            if (voteStatus === 'ACEPTADO' || voteStatus === 'RECHAZADO') {
                throw new Error(
                    `No se pueden editar comentarios con votación "${voteStatus}". ` +
                    `Solo los comentarios con votación "ACTUALIZA" pueden ser modificados.`
                );
            }

            // Verificar que la propuesta no esté en una convocatoria expirada
            const propuesta = await this.propuestaRepository.getPropuesta(comment.getProposalId());
            if (!propuesta) {
                throw new Error("Propuesta asociada no encontrada");
            }

            // Verificar si la convocatoria está expirada
            const convocatoria = await this.propuestaRepository.getActiveConvocatoria();
            if (convocatoria && propuesta.getConvocatoriaId() !== convocatoria.id) {
                // La propuesta no está en la convocatoria activa, verificar si está expirada
                const now = new Date();
                // Aquí podrías agregar lógica adicional para verificar si la convocatoria está expirada
                // Por ahora asumimos que si no está en la convocatoria activa, no se puede editar
                throw new Error("No se pueden editar comentarios de propuestas de convocatorias expiradas");
            }

            console.log('✅ Comentario puede ser editado');
        } catch (error) {
            console.error("Error in ValidateCommentEditUseCase:", error);
            throw error;
        }
    }
}



