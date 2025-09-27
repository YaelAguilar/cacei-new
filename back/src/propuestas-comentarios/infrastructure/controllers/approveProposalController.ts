// src/propuestas-comentarios/infrastructure/controllers/approveProposalController.ts
import { Request, Response } from 'express';
import { ApproveProposalUseCase } from '../../application/approveProposalUseCase';

export class ApproveProposalController {
    constructor(private readonly approveProposalUseCase: ApproveProposalUseCase) {}

    async run(req: Request, res: Response): Promise<void> {
        console.log('🏁 ApproveProposalController iniciado');
        console.log('📝 Body recibido:', req.body);
        
        const { proposalId, comment } = req.body;
        console.log('📝 proposalId extraído:', proposalId);
        console.log('📝 comment extraído:', comment);
        console.log('📝 Tipo de proposalId:', typeof proposalId);

        try {
            // Obtener el tutor del token JWT
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

            // Obtener información completa del tutor desde la base de datos
            const { query } = require('../../../database/mysql');
            const tutorResult = await query(
                'SELECT id, name, lastName, secondLastName, email FROM users WHERE uuid = ? AND active = true', 
                [userFromToken.uuid]
            );
            
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
                    errors: [{
                        status: "400",
                        title: "Bad Request",
                        detail: "El ID de la propuesta es obligatorio"
                    }]
                });
                return;
            }

            console.log('🔍 Ejecutando approveProposalUseCase...');
            const approved = await this.approveProposalUseCase.run(
                proposalId,
                tutor.id,
                tutorFullName,
                tutor.email,
                comment || ''
            );

            console.log('📋 Aprobación resultado:', approved ? 'exitosa' : 'falló');

            if (approved) {
                console.log('✅ Enviando respuesta exitosa');
                res.status(200).json({
                    data: {
                        type: "proposal-approval",
                        id: proposalId,
                        attributes: {
                            approved: true,
                            approvedBy: tutorFullName,
                            approvedByEmail: tutor.email,
                            approvedAt: new Date().toISOString(),
                            message: "Propuesta aprobada en su totalidad exitosamente"
                        }
                    }
                });
            } else {
                console.log('❌ No se pudo aprobar la propuesta');
                res.status(400).json({
                    errors: [{
                        status: "400",
                        title: "Could not approve proposal",
                        detail: "No se pudo aprobar la propuesta"
                    }]
                });
            }
        } catch (error) {
            console.error("❌ Error in ApproveProposalController:", error);
            
            if (error instanceof Error) {
                const errorMessage = error.message;
                
                const businessErrors = [
                    "es obligatorio",
                    "Propuesta no encontrada",
                    "No se puede aprobar toda la propuesta si ya existen comentarios"
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