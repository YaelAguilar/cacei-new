// src/propuestas-comentarios/infrastructure/controllers/updateProposalController.ts
import { Request, Response } from "express";
import { UpdateProposalUseCase } from "../../application/updateProposalUseCase";

export class UpdateProposalController {
    constructor(private readonly updateProposalUseCase: UpdateProposalUseCase) {}

    async run(req: Request, res: Response): Promise<void> {
        console.log('🏁 UpdateProposalController iniciado');
        
        try {
            const { proposalId } = req.body;

            // Obtener información del tutor desde el token
            const userFromToken = (req as any).user;
            
            if (!userFromToken) {
                console.log('❌ Token de usuario no encontrado');
                res.status(401).json({
                    errors: [{
                        status: "401",
                        title: "Unauthorized",
                        detail: "Token de autenticación requerido"
                    }]
                });
                return;
            }

            // Obtener información completa del tutor
            const tutor = await this.getTutorInfo(userFromToken.uuid);
            if (!tutor) {
                console.log('❌ Tutor no encontrado');
                res.status(404).json({
                    errors: [{
                        status: "404",
                        title: "Not Found",
                        detail: "Tutor no encontrado"
                    }]
                });
                return;
            }

            const tutorFullName = `${tutor.name} ${tutor.lastName} ${tutor.secondLastName || ''}`.trim();

            console.log('👤 Tutor encontrado:', {
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

            console.log('🔍 Ejecutando updateProposalUseCase...');
            const updated = await this.updateProposalUseCase.run(
                proposalId,
                tutor.id,
                tutorFullName,
                tutor.email
            );

            console.log('📋 Actualización resultado:', updated ? 'exitoso' : 'falló');

            if (updated) {
                console.log('✅ Enviando respuesta exitosa');
                res.status(200).json({
                    data: {
                        type: "proposal-update",
                        id: proposalId,
                        attributes: {
                            updated: true,
                            updatedBy: tutorFullName,
                            updatedByEmail: tutor.email,
                            updatedAt: new Date().toISOString(),
                            message: "Propuesta marcada para actualización exitosamente"
                        }
                    }
                });
            } else {
                console.log('❌ No se pudo actualizar la propuesta');
                res.status(400).json({
                    errors: [{
                        status: "400",
                        title: "Could not update proposal",
                        detail: "No se pudo solicitar actualización de la propuesta"
                    }]
                });
            }
        } catch (error) {
            console.error("❌ Error in UpdateProposalController:", error);
            res.status(500).json({
                errors: [{
                    status: "500",
                    title: "Internal Server Error",
                    detail: error instanceof Error ? error.message : "Error interno del servidor"
                }]
            });
        }
    }

    private async getTutorInfo(userUuid: string): Promise<any> {
        try {
            const { query } = await import("../../../database/mysql");
            const sql = `
                SELECT id, name, lastName, secondLastName, email 
                FROM users 
                WHERE uuid = ? AND active = true
            `;
            const result: any = await query(sql, [userUuid]);
            return result.length > 0 ? result[0] : null;
        } catch (error) {
            console.error("Error getting tutor info:", error);
            return null;
        }
    }
}
