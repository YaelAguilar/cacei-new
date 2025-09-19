// src/propuestas-comentarios/infrastructure/controllers/createCommentController.ts
import { Request, Response } from 'express';
import { CreateCommentUseCase } from '../../application/createCommentUseCase';

export class CreateCommentController {
    constructor(private readonly createCommentUseCase: CreateCommentUseCase) {}

    async run(req: Request, res: Response): Promise<void> {
        console.log('🏁 CreateCommentController iniciado');
        console.log('📝 Body recibido:', req.body);
        
        const {
            proposalId,  // Este viene del frontend (puede ser UUID)
            sectionName,
            subsectionName,
            commentText,
            voteStatus
        } = req.body;

        try {
            // Obtener el ID del tutor del token JWT
            console.log('🔍 Verificando token...');
            const userFromToken = (req as any).user;
            
            if (!userFromToken || !userFromToken.uuid) {
                console.log('❌ Token inválido');
                res.status(401).json({
                    errors: [{
                        status: "401",
                        title: "Unauthorized",
                        detail: "Token de usuario inválido"
                    }]
                });
                return;
            }

            console.log('✅ Token válido, UUID:', userFromToken.uuid);

            // Obtener el ID del tutor desde la base de datos
            const { query } = require('../../../database/mysql');
            const tutorResult = await query('SELECT id FROM users WHERE uuid = ? AND active = true', [userFromToken.uuid]);
            
            if (tutorResult.length === 0) {
                console.log('❌ Tutor no encontrado en BD');
                res.status(404).json({
                    errors: [{
                        status: "404",
                        title: "User not found",
                        detail: "Tutor no encontrado"
                    }]
                });
                return;
            }

            const tutorId = tutorResult[0].id;
            console.log('✅ ID del tutor encontrado:', tutorId);

            // ⭐ NUEVO: Convertir proposalId (UUID) a ID numérico
            let numericProposalId: number;
            
            if (isNaN(Number(proposalId))) {
                // Es un UUID, convertir a ID numérico
                console.log('🔄 Convirtiendo UUID a ID numérico:', proposalId);
                const proposalQuery = 'SELECT id FROM project_proposals WHERE uuid = ? AND active = true';
                const proposalResult = await query(proposalQuery, [proposalId]);
                
                if (proposalResult.length === 0) {
                    console.log('❌ Propuesta no encontrada con UUID:', proposalId);
                    res.status(404).json({
                        errors: [{
                            status: "404",
                            title: "Proposal not found",
                            detail: "Propuesta no encontrada"
                        }]
                    });
                    return;
                }
                
                numericProposalId = proposalResult[0].id;
                console.log('✅ ID numérico de propuesta encontrado:', numericProposalId);
            } else {
                // Ya es un ID numérico
                numericProposalId = Number(proposalId);
                console.log('✅ proposalId ya es numérico:', numericProposalId);
            }

            // Validar campos requeridos
            if (!proposalId || !sectionName || !subsectionName || !commentText || !voteStatus) {
                console.log('❌ Faltan campos requeridos');
                res.status(400).json({
                    errors: [{
                        status: "400",
                        title: "Bad Request",
                        detail: "Todos los campos son obligatorios"
                    }]
                });
                return;
            }

            console.log('🔍 Ejecutando createCommentUseCase con ID numérico:', numericProposalId);
            const comment = await this.createCommentUseCase.run(
                numericProposalId,  // ⭐ Ahora pasamos el ID numérico
                tutorId,
                sectionName,
                subsectionName,
                commentText,
                voteStatus
            );

            console.log('📋 Comentario creado:', comment ? 'exitosamente' : 'falló');

            if (comment) {
                const formattedComment = {
                    type: "proposal-comment",
                    id: comment.getUuid(),
                    attributes: {
                        proposalId: comment.getProposalId(),
                        tutorId: comment.getTutorId(),
                        sectionName: comment.getSectionName(),
                        subsectionName: comment.getSubsectionName(),
                        commentText: comment.getCommentText(),
                        voteStatus: comment.getVoteStatus(),
                        active: comment.isActive(),
                        createdAt: comment.getCreatedAt(),
                        updatedAt: comment.getUpdatedAt()
                    }
                };

                console.log('✅ Enviando respuesta exitosa');
                res.status(201).json({ data: formattedComment });
            } else {
                console.log('❌ No se pudo crear el comentario');
                res.status(400).json({
                    errors: [{
                        status: "400",
                        title: "Could not create comment",
                        detail: "No se pudo crear el comentario"
                    }]
                });
            }
        } catch (error) {
            console.error("❌ Error in CreateCommentController:", error);
            
            if (error instanceof Error) {
                const errorMessage = error.message;
                
                const businessErrors = [
                    "Ya existe un comentario",
                    "es obligatorio",
                    "debe tener al menos",
                    "debe ser ACEPTADO"
                ];
                
                if (businessErrors.some(msg => errorMessage.includes(msg))) {
                    res.status(400).json({
                        errors: [{
                            status: "400",
                            title: "Business Logic Error",
                            detail: errorMessage
                        }]
                    });
                    return;
                }
            }
            
            if (!res.headersSent) {
                res.status(500).json({
                    errors: [{
                        status: "500",
                        title: "Server error",
                        detail: error instanceof Error ? error.message : String(error)
                    }]
                });
            }
        }
    }
}