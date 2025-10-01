// src/propuestas-comentarios/infrastructure/controllers/syncProposalStatusController.ts
import { Request, Response } from 'express';
import { SyncProposalStatusUseCase } from '../../application/syncProposalStatusUseCase';

export class SyncProposalStatusController {
    constructor(private readonly syncProposalStatusUseCase: SyncProposalStatusUseCase) {}

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

            console.log(`🔄 Sincronizando estado de propuesta: ${proposalId}`);
            
            const success = await this.syncProposalStatusUseCase.execute(proposalId);
            
            if (success) {
                res.status(200).json({
                    success: true,
                    message: 'Estado de propuesta sincronizado exitosamente'
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Error al sincronizar el estado de la propuesta'
                });
            }
            
        } catch (error) {
            console.error('❌ Error en SyncProposalStatusController:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }
}

