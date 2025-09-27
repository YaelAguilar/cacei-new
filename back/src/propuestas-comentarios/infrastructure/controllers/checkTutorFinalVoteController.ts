// src/propuestas-comentarios/infrastructure/controllers/checkTutorFinalVoteController.ts
import { Request, Response } from 'express';
import { CheckTutorFinalVoteUseCase } from '../../application/checkTutorFinalVoteUseCase';

export class CheckTutorFinalVoteController {
    constructor(private readonly checkTutorFinalVoteUseCase: CheckTutorFinalVoteUseCase) {}

    async run(req: Request, res: Response): Promise<void> {
        console.log('🔍 CheckTutorFinalVoteController iniciado');
        console.log('📝 Proposal ID:', req.params.proposalId);
        
        const { proposalId } = req.params;

        try {
            // Obtener el tutor del token JWT
            const userFromToken = (req as any).user;
            
            if (!userFromToken || !userFromToken.uuid) {
                console.log('❌ Token inválido');
                res.status(401).json({
                    success: false,
                    errors: [{
                        status: "401",
                        title: "Unauthorized",
                        detail: "Token de usuario inválido"
                    }]
                });
                return;
            }

            console.log('✅ Token válido, UUID:', userFromToken.uuid);

            // Obtener información completa del tutor desde la base de datos
            const { query } = require('../../../database/mysql');
            const tutorResult = await query(
                'SELECT id, name, lastName, secondLastName, email FROM users WHERE uuid = ? AND active = true', 
                [userFromToken.uuid]
            );
            
            if (tutorResult.length === 0) {
                console.log('❌ Tutor no encontrado en BD');
                res.status(404).json({
                    success: false,
                    errors: [{
                        status: "404",
                        title: "User not found",
                        detail: "Tutor no encontrado"
                    }]
                });
                return;
            }

            const tutor = tutorResult[0];
            const tutorFullName = `${tutor.name} ${tutor.lastName} ${tutor.secondLastName || ''}`.trim();

            console.log('✅ Información del tutor obtenida:', {
                id: tutor.id,
                name: tutorFullName,
                email: tutor.email
            });

            // Validar que se proporcione el ID de la propuesta
            if (!proposalId) {
                console.log('❌ ID de propuesta faltante');
                res.status(400).json({
                    success: false,
                    errors: [{
                        status: "400",
                        title: "Bad Request",
                        detail: "El ID de la propuesta es obligatorio"
                    }]
                });
                return;
            }

            console.log('🔍 Ejecutando checkTutorFinalVoteUseCase...');
            const result = await this.checkTutorFinalVoteUseCase.run(proposalId, tutor.id);

            console.log('📋 Resultado verificación voto final:', result);

            if (result.hasVoted) {
                console.log('✅ Tutor ya votó con voto final');
                res.status(200).json({
                    success: true,
                    data: {
                        hasVoted: true,
                        voteStatus: result.voteStatus,
                        commentText: result.commentText,
                        createdAt: result.createdAt,
                        tutorName: tutorFullName,
                        tutorEmail: tutor.email
                    }
                });
            } else {
                console.log('ℹ️ Tutor no ha votado con voto final');
                res.status(200).json({
                    success: true,
                    data: {
                        hasVoted: false
                    }
                });
            }
        } catch (error) {
            console.error("❌ Error in CheckTutorFinalVoteController:", error);
            
            if (error instanceof Error) {
                const errorMessage = error.message;
                
                const businessErrors = [
                    "es obligatorio",
                    "Propuesta no encontrada",
                    "Tutor no encontrado"
                ];
                
                if (businessErrors.some(msg => errorMessage.includes(msg))) {
                    res.status(400).json({
                        success: false,
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
                    success: false,
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