// src/propuestas/infrastructure/controllers/updatePropuestaController.ts
import { Request, Response } from 'express';
import { UpdatePropuestaUseCase } from '../../application/updatePropuestaUseCase';

export class UpdatePropuestaController {
    constructor(private readonly updatePropuestaUseCase: UpdatePropuestaUseCase) {}

    async run(req: Request, res: Response): Promise<void> {
        const { uuid } = req.params;
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
            if (!uuid) {
                res.status(400).json({
                    errors: [{
                        status: "400",
                        title: "Bad Request",
                        detail: "UUID es obligatorio"
                    }]
                });
                return;
            }

            let fechaInicioDate: Date | undefined;
            let fechaFinDate: Date | undefined;

            if (fechaInicio) {
                fechaInicioDate = new Date(fechaInicio);
                if (isNaN(fechaInicioDate.getTime())) {
                    res.status(400).json({
                        errors: [{
                            status: "400",
                            title: "Bad Request",
                            detail: "Formato de fecha de inicio inválido"
                        }]
                    });
                    return;
                }
            }

            if (fechaFin) {
                fechaFinDate = new Date(fechaFin);
                if (isNaN(fechaFinDate.getTime())) {
                    res.status(400).json({
                        errors: [{
                            status: "400",
                            title: "Bad Request",
                            detail: "Formato de fecha de fin inválido"
                        }]
                    });
                    return;
                }
            }

            const propuesta = await this.updatePropuestaUseCase.run(
                uuid,
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
                paginaWebEmpresa
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

                res.status(200).json({ data: formattedPropuesta });
            } else {
                res.status(404).json({
                    errors: [{
                        status: "404",
                        title: "Propuesta not found",
                        detail: "No se pudo actualizar la propuesta. Verificar el UUID o que la propuesta esté activa"
                    }]
                });
            }
        } catch (error) {
            console.error("Error in UpdatePropuestaController:", error);
            
            if (error instanceof Error) {
                const errorMessage = error.message;
                
                const businessErrors = [
                    "Propuesta no encontrada",
                    "No hay una convocatoria activa disponible",
                    "Solo se pueden actualizar propuestas de la convocatoria activa",
                    "es obligatorio",
                    "no puede ser anterior",
                    "debe ser posterior",
                    "no está disponible en la convocatoria actual",
                    "No hay campos para actualizar"
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