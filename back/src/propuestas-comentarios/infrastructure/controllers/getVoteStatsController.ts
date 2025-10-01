// src/propuestas-comentarios/infrastructure/controllers/getVoteStatsController.ts
import { Request, Response } from 'express';
import { GetVoteStatsUseCase } from '../../application/getVoteStatsUseCase';

export class GetVoteStatsController {
    constructor(private readonly getVoteStatsUseCase: GetVoteStatsUseCase) {}

    async run(req: Request, res: Response): Promise<void> {
        try {
            const { proposalId } = req.params;
            
            if (!proposalId) {
                res.status(400).json({
                    success: false,
                    message: 'ID de propuesta requerido'
                });
                return;
            }

            console.log(`📊 Obteniendo estadísticas de votos para propuesta: ${proposalId}`);
            
            const voteStats = await this.getVoteStatsUseCase.run(proposalId);
            
            res.status(200).json({
                success: true,
                data: voteStats
            });
            
        } catch (error) {
            console.error('❌ Error en GetVoteStatsController:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }
}


