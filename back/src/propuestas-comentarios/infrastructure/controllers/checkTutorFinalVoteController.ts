// src/propuestas-comentarios/infrastructure/controllers/checkTutorFinalVoteController.ts
import { Request, Response } from 'express';
import { CheckTutorFinalVoteUseCase } from '../../application/checkTutorFinalVoteUseCase';
import { MysqlCommentRepository } from '../repositories/MysqlCommentRepository';

export class CheckTutorFinalVoteController {
    private checkTutorFinalVoteUseCase: CheckTutorFinalVoteUseCase;

    constructor() {
        const commentRepository = new MysqlCommentRepository();
        this.checkTutorFinalVoteUseCase = new CheckTutorFinalVoteUseCase(commentRepository);
    }

    async run(req: Request, res: Response): Promise<void> {
        try {
            const { proposalId } = req.params;
            const tutorId = (req as any).user?.id;

            if (!tutorId) {
                res.status(401).json({
                    success: false,
                    message: 'Usuario no autenticado'
                });
                return;
            }

            if (!proposalId) {
                res.status(400).json({
                    success: false,
                    message: 'ID de propuesta requerido'
                });
                return;
            }

            console.log('🔍 CheckTutorFinalVoteController ejecutándose:', { proposalId, tutorId });

            const result = await this.checkTutorFinalVoteUseCase.execute(proposalId, tutorId);

            res.status(200).json({
                success: true,
                data: result
            });

        } catch (error) {
            console.error('Error in CheckTutorFinalVoteController:', error);
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Error interno del servidor'
            });
        }
    }
}
