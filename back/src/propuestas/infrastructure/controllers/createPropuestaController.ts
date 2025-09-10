// src/propuestas/infrastructure/controllers/createPropuestaController.ts
import { Request, Response } from 'express';
import { CreatePropuestaUseCase } from '../../application/createPropuestaUseCase';

export class CreatePropuestaController {
    constructor(private readonly createPropuestaUseCase: CreatePropuestaUseCase) {}

    async run(req: Request, res: Response): Promise<void> {
        const {
            tutorAcademicoId,
            tipoPasantia,
            nombreProyecto,
            descripcionProyecto,
            entregables,
            tecnologias,
            supervisorProyecto,
            actividades,
            fechaInicio,
            fechaFin,
            nombreEmpresa,
            sectorEmpresa,
            personaContacto,
            paginaWebEmpresa
        } = req.body;

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

            // Validar campos requeridos
            if (!tutorAcademicoId || !tipoPasantia || !nombreProyecto || !descripcionProyecto || 
                !entregables || !tecnologias || !supervisorProyecto || !actividades || 
                !fechaInicio || !fechaFin || !nombreEmpresa || !sectorEmpresa || !personaContacto) {
                res.status(400).json({
                    errors: [{
                        status: "400",
                        title: "Bad Request",
                        detail: "Todos los campos obligatorios deben ser proporcionados"
                    }]
                });
                return;
            }

            // Convertir fechas
            const fechaInicioDate = new Date(fechaInicio);
            const fechaFinDate = new Date(fechaFin);
            
            if (isNaN(fechaInicioDate.getTime()) || isNaN(fechaFinDate.getTime())) {
                res.status(400).json({
                    errors: [{
                        status: "400",
                        title: "Bad Request",
                        detail: "Formato de fechas inválido"
                    }]
                });
                return;
            }

            const propuesta = await this.createPropuestaUseCase.run(
                idAlumno,
                tutorAcademicoId,
                tipoPasantia,
                nombreProyecto,
                descripcionProyecto,
                entregables,
                tecnologias,
                supervisorProyecto,
                actividades,
                fechaInicioDate,
                fechaFinDate,
                nombreEmpresa,
                sectorEmpresa,
                personaContacto,
                paginaWebEmpresa || null
            );

            if (propuesta) {
                const formattedPropuesta = {
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
                };

                res.status(201).json({ data: formattedPropuesta });
            } else {
                res.status(400).json({
                    errors: [{
                        status: "400",
                        title: "Could not create propuesta",
                        detail: "No se pudo crear la propuesta"
                    }]
                });
            }
        } catch (error) {
            console.error("Error in CreatePropuestaController:", error);
            
            if (error instanceof Error) {
                const errorMessage = error.message;
                
                const businessErrors = [
                    "No hay una convocatoria activa disponible",
                    "Ya tienes una propuesta registrada en la convocatoria actual",
                    "es obligatorio",
                    "no puede ser anterior",
                    "debe ser posterior",
                    "no está disponible en la convocatoria actual"
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