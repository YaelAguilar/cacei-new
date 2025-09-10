// src/propuestas/infrastructure/controllers/getPropuestaController.ts
import { Request, Response } from 'express';
import { GetPropuestaUseCase } from '../../application/getPropuestasUseCase';

export class GetPropuestaController {
    constructor(private readonly getPropuestaUseCase: GetPropuestaUseCase) {}

    async run(req: Request, res: Response): Promise<void> {
        const { uuid } = req.params;

        try {
            const propuesta = await this.getPropuestaUseCase.run(uuid);

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
                        detail: "No se encontró la propuesta con el UUID proporcionado"
                    }]
                });
            }
        } catch (error) {
            console.error("Error in GetPropuestaController:", error);
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