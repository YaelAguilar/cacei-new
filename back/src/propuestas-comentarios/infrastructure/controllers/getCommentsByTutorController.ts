// src/propuestas-comentarios/infrastructure/controllers/getCommentsByTutorController.ts
import { Request, Response } from 'express';
import { GetCommentsByTutorUseCase } from '../../application/getCommentsByTutorUseCase';

export class GetCommentsByTutorController {
    constructor(private readonly getCommentsByTutorUseCase: GetCommentsByTutorUseCase) {}

    async run(req: Request, res: Response): Promise<void> {
        console.log('🏁 GetCommentsByTutorController iniciado');
        
        try {
            // Obtener el ID del tutor del token JWT
            const userFromToken = (req as any).user;
            
            if (!userFromToken || !userFromToken.uuid) {
                res.status(401).json({
                    errors: [{
                        status: "401",
                        title: "Unauthorized",
                        detail: "Token de usuario inválido"
                    }]
                });
                return;
            }

            // Obtener el ID del tutor desde la base de datos
            const { query } = require('../../../database/mysql');
            const tutorResult = await query('SELECT id FROM users WHERE uuid = ? AND active = true', [userFromToken.uuid]);
            
            if (tutorResult.length === 0) {
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

            const comments = await this.getCommentsByTutorUseCase.run(tutorId);

            const formattedComments = comments ? comments.map(comment => ({
                type: "proposal-comment",
                id: comment.getUuid(),
                attributes: {
                    proposalId: comment.getProposalId(),
                    proposalUuid: comment.getProposalUuid(),
                    projectName: comment.getProjectName(),
                    companyShortName: comment.getCompanyShortName(),
                    sectionName: comment.getSectionName(),
                    subsectionName: comment.getSubsectionName(),
                    commentText: comment.getCommentText(),
                    voteStatus: comment.getVoteStatus(),
                    active: comment.isActive(),
                    createdAt: comment.getCreatedAt(),
                    updatedAt: comment.getUpdatedAt()
                }
            })) : [];

            res.status(200).json({ data: formattedComments });
        } catch (error) {
            console.error("Error in GetCommentsByTutorController:", error);
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