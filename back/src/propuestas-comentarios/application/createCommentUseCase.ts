// src/propuestas-comentarios/application/createCommentUseCase.ts
import { CommentRepository, CommentCreateData } from "../domain/interfaces/commentRepository";
import { ProposalComment } from "../domain/models/proposalComment";
import { UpdateProposalStatusAfterCommentUseCase } from "./updateProposalStatusAfterCommentUseCase";
import { PropuestaRepository } from "../../propuestas/domain/interfaces/propuestaRepository";
import mysql from 'mysql2/promise';

export class CreateCommentUseCase {
    constructor(
        private readonly commentRepository: CommentRepository,
        private readonly updateProposalStatusUseCase: UpdateProposalStatusAfterCommentUseCase,
        private readonly propuestaRepository: PropuestaRepository
    ) {}

    async run(
        proposalId: string | number,
        tutorId: number,
        sectionName: string,
        subsectionName: string,
        commentText: string,
        voteStatus: 'ACEPTADO' | 'RECHAZADO' | 'ACTUALIZA'
    ): Promise<ProposalComment | null> {
        try {
            // ✅ NUEVO: Verificar que la propuesta no esté APROBADO o RECHAZADO
            await this.validateProposalStatus(proposalId);

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

            // ✅ NUEVO: Verificar si el tutor ya tiene votos finales contradictorios
            await this.validateNoConflictingFinalVotes(
                typeof proposalId === 'string' ? proposalId : proposalId.toString(),
                tutorId,
                voteStatus
            );

            // Crear el comentario
            const commentData: CommentCreateData = {
                proposalId: typeof proposalId === 'string' ? proposalId : proposalId.toString(),
                tutorId,
                sectionName: sectionName.trim(),
                subsectionName: subsectionName.trim(),
                commentText: commentText.trim(),
                voteStatus
            };

            const createdComment = await this.commentRepository.createComment(commentData);
            
            // ✅ NUEVO: Actualizar automáticamente el estado de la propuesta
            if (createdComment) {
                try {
                    console.log(`🔄 DEBUG: Intentando actualizar estado de propuesta ${createdComment.getProposalId()}`);
                    const updateResult = await this.updateProposalStatusUseCase.run(createdComment.getProposalId());
                    console.log(`✅ DEBUG: Resultado de actualización:`, updateResult);
                } catch (statusError) {
                    console.error("❌ DEBUG: Error updating proposal status after comment creation:", statusError);
                    // No lanzamos el error para no afectar la creación del comentario
                }
            }

            return createdComment;
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

        // ✅ REGLAS DE NEGOCIO CORREGIDAS:
        // - ACEPTADO/RECHAZADO: Solo para propuesta completa (usar endpoints específicos)
        // - ACTUALIZA: Solo para secciones específicas (con comentario obligatorio)
        
        if (voteStatus === 'ACEPTADO' || voteStatus === 'RECHAZADO') {
            const error = new Error(
                `Los votos "${voteStatus}" solo pueden aplicarse a la propuesta completa. ` +
                `Para votar por secciones específicas, use "ACTUALIZA" y proporcione un comentario detallado. ` +
                `Para aprobar/rechazar la propuesta completa, use los endpoints específicos de aprobación/rechazo.`
            );
            error.statusCode = 400;
            throw error;
        }

        if (voteStatus !== 'ACTUALIZA') {
            throw new Error("Para comentarios por sección, el estado de votación debe ser 'ACTUALIZA'");
        }
    }

    /**
     * Valida que el tutor no tenga votos finales contradictorios para la misma propuesta
     */
    private async validateNoConflictingFinalVotes(
        proposalId: string,
        tutorId: number,
        newVoteStatus: 'ACEPTADO' | 'RECHAZADO' | 'ACTUALIZA'
    ): Promise<void> {
        // Solo validar si el nuevo voto es final (ACEPTADO o RECHAZADO)
        if (newVoteStatus === 'ACTUALIZA') {
            return;
        }

        // Verificar si el tutor ya tiene votos finales para esta propuesta
        const existingFinalVotes = await this.commentRepository.hasTutorVotedFinal(proposalId, tutorId);
        
        if (existingFinalVotes.hasVoted) {
            const existingStatus = existingFinalVotes.voteStatus;
            
            // Si ya tiene un voto final diferente, no permitir el nuevo voto
            if (existingStatus !== newVoteStatus) {
                throw new Error(
                    `No se puede emitir un voto "${newVoteStatus}" porque ya existe un voto final "${existingStatus}" ` +
                    `de este tutor para esta propuesta. Un tutor solo puede tener un voto final por propuesta.`
                );
            }
            
            // Si ya tiene el mismo voto final, también rechazar para evitar duplicados
            throw new Error(
                `Ya existe un voto final "${existingStatus}" de este tutor para esta propuesta. ` +
                `No se permiten votos finales duplicados.`
            );
        }
    }

    /**
     * Valida que la propuesta no esté en estado APROBADO o RECHAZADO
     */
    private async validateProposalStatus(proposalId: string | number): Promise<void> {
        try {
            // Si es un número, necesitamos obtener el UUID primero
            let proposalUuid: string;
            if (typeof proposalId === 'number') {
                // Buscar el UUID por ID numérico
                const connection = await mysql.createConnection({
                    host: 'localhost',
                    user: 'root',
                    password: 'yaeL100010010-',
                    database: 'caceiv2_db',
                    charset: 'utf8mb4'
                });
                
                const [result] = await connection.execute(
                    'SELECT uuid FROM project_proposals WHERE id = ? AND active = 1',
                    [proposalId]
                );
                await connection.end();
                
                if (!result || result.length === 0) {
                    throw new Error("Propuesta no encontrada");
                }
                
                proposalUuid = result[0].uuid;
            } else {
                proposalUuid = proposalId;
            }
            
            const proposal = await this.propuestaRepository.getPropuesta(proposalUuid);
            
            if (!proposal) {
                throw new Error("Propuesta no encontrada");
            }

            const currentStatus = proposal.getProposalStatus();
            
            if (currentStatus === 'APROBADO') {
                throw new Error(
                    "No se pueden crear comentarios en propuestas que ya han sido APROBADAS. " +
                    "La evaluación de esta propuesta ha sido cerrada."
                );
            }
            
            if (currentStatus === 'RECHAZADO') {
                throw new Error(
                    "No se pueden crear comentarios en propuestas que ya han sido RECHAZADAS. " +
                    "La evaluación de esta propuesta ha sido cerrada."
                );
            }
        } catch (error) {
            console.error("Error validating proposal status:", error);
            throw error;
        }
    }
}