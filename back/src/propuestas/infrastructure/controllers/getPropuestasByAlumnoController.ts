// src/propuestas/infrastructure/controllers/getPropuestasByAlumnoController.ts
import { Request, Response } from 'express';
import { GetPropuestasByAlumnoUseCase } from '../../application/getPropuestasUseCase';

export class GetPropuestasByAlumnoController {
    constructor(private readonly getPropuestasByAlumnoUseCase: GetPropuestasByAlumnoUseCase) {}

    async run(req: Request, res: Response): Promise<void> {
        try {
            // Obtener el ID del alumno del token JWT
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

            // Obtener el ID del alumno desde la base de datos usando el UUID del token
            const { query } = require('../../../database/mysql');
            const userResult = await query('SELECT id FROM users WHERE uuid = ? AND active = true', [userFromToken.uuid]);
            if (userResult.length === 0) {
                res.status(404).json({
                    errors: [{
                        status: "404",
                        title: "User not found",
                        detail: "Usuario no encontrado"
                    }]
                });
                return;
            }

            const idAlumno = userResult[0].id;

            const propuestas = await this.getPropuestasByAlumnoUseCase.run(idAlumno);

            const formattedPropuestas = propuestas ? propuestas.map(propuesta => ({
                type: "propuesta",
                id: propuesta.getUuid(),
                attributes: {
                    idConvocatoria: propuesta.getIdConvocatoria(),
                    tutorAcademico: {
                        id: propuesta.getTutorAcademicoId(),
                        nombre: propuesta.getTutorAcademicoNombre(),
                        email: propuesta.getTutorAcademicoEmail()
                    },
                    tipoPasantia: propuesta.getTipoPasantia(),
                    proyecto: {
                        nombre: propuesta.getNombreProyecto(),
                        descripcion: propuesta.getDescripcionProyecto(),
                        entregables: propuesta.getEntregables(),
                        tecnologias: propuesta.getTecnologias(),
                        supervisor: propuesta.getSupervisorProyecto(),
                        actividades: propuesta.getActividades(),
                        fechaInicio: propuesta.getFechaInicio(),
                        fechaFin: propuesta.getFechaFin()
                    },
                    empresa: {
                        nombre: propuesta.getNombreEmpresa(),
                        sector: propuesta.getSectorEmpresa(),
                        personaContacto: propuesta.getPersonaContacto(),
                        paginaWeb: propuesta.getPaginaWebEmpresa()
                    },
                    active: propuesta.isActive(),
                    createdAt: propuesta.getCreatedAt(),
                    updatedAt: propuesta.getUpdatedAt()
                }
            })) : [];

            res.status(200).json({
                data: formattedPropuestas
            });
        } catch (error) {
            console.error("Error in GetPropuestasByAlumnoController:", error);
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