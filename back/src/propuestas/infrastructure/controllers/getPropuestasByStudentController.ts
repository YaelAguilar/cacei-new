// src/propuestas/infrastructure/controllers/getPropuestasByStudentController.ts
import { Request, Response } from 'express';
import { GetPropuestasByStudentUseCase } from '../../application/getPropuestasUseCase';

export class GetPropuestasByStudentController {
    constructor(private readonly getPropuestasByStudentUseCase: GetPropuestasByStudentUseCase) {}

    async run(req: Request, res: Response): Promise<void> {
        console.log('🏁 GetPropuestasByStudentController iniciado');
        
        try {
            // Obtener el ID del estudiante del token JWT
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

            // Obtener el ID del estudiante desde la base de datos usando el UUID del token
            console.log('🔍 Consultando usuario en BD...');
            const { query } = require('../../../database/mysql');
            const userResult = await query('SELECT id FROM users WHERE uuid = ? AND active = true', [userFromToken.uuid]);
            
            if (userResult.length === 0) {
                console.log('❌ Usuario no encontrado en BD');
                res.status(404).json({
                    errors: [{
                        status: "404",
                        title: "User not found",
                        detail: "Usuario no encontrado"
                    }]
                });
                return;
            }

            const studentId = userResult[0].id;
            console.log('✅ ID del estudiante encontrado:', studentId);

            console.log('🔍 Ejecutando getPropuestasByStudentUseCase...');
            const propuestas = await this.getPropuestasByStudentUseCase.run(studentId);
            console.log('📋 Propuestas obtenidas:', propuestas ? propuestas.length : 'null');

            const formattedPropuestas = propuestas ? propuestas.map(propuesta => ({
                type: "propuesta",
                id: propuesta.getUuid(),
                attributes: {
                    idConvocatoria: propuesta.getConvocatoriaId(),
                    tutorAcademico: {
                        id: propuesta.getAcademicTutorId(),
                        nombre: propuesta.getAcademicTutorName(),
                        email: propuesta.getAcademicTutorEmail()
                    },
                    tipoPasantia: propuesta.getInternshipType(),
                    proyecto: {
                        nombre: propuesta.getProjectName(),
                        descripcion: propuesta.getProjectProblemDescription(),
                        entregables: propuesta.getProjectPlannedDeliverables(),
                        tecnologias: propuesta.getProjectTechnologies(),
                        supervisor: propuesta.getSupervisorName(),
                        actividades: propuesta.getProjectMainActivities(),
                        fechaInicio: propuesta.getProjectStartDate(),
                        fechaFin: propuesta.getProjectEndDate()
                    },
                    empresa: {
                        nombre: propuesta.getCompanyShortName(),
                        sector: propuesta.getContactArea(),
                        personaContacto: propuesta.getContactName(),
                        paginaWeb: propuesta.getCompanyWebsite()
                    },
                    active: propuesta.isActive(),
                    createdAt: propuesta.getCreatedAt(),
                    updatedAt: propuesta.getUpdatedAt()
                }
            })) : [];

            console.log('✅ Enviando respuesta:', formattedPropuestas.length, 'propuestas');
            res.status(200).json({
                data: formattedPropuestas
            });
            
        } catch (error) {
            console.error("❌ Error in GetPropuestasByStudentController:", error);
            
            if (!res.headersSent) {
                res.status(500).json({
                    errors: [{
                        status: "500",
                        title: "Error retrieving propuestas",
                        detail: error instanceof Error ? error.message : String(error)
                    }]
                });
            }
        }
    }
}
