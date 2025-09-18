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
                        idConvocatoria: propuesta.getConvocatoriaId(),
                        tutorAcademico: {
                            id: propuesta.getAcademicTutorId(),        // CORREGIDO
                            nombre: propuesta.getAcademicTutorName(),   // CORREGIDO
                            email: propuesta.getAcademicTutorEmail()    // CORREGIDO
                        },
                        tipoPasantia: propuesta.getInternshipType(),   // CORREGIDO
                        proyecto: {
                            nombre: propuesta.getProjectName(),                    // CORREGIDO
                            descripcion: propuesta.getProjectProblemDescription(), // CORREGIDO
                            entregables: propuesta.getProjectPlannedDeliverables(),// CORREGIDO
                            tecnologias: propuesta.getProjectTechnologies(),       // CORREGIDO
                            supervisor: propuesta.getSupervisorName(),             // CORREGIDO
                            actividades: propuesta.getProjectMainActivities(),     // CORREGIDO
                            fechaInicio: propuesta.getProjectStartDate(),          // CORREGIDO
                            fechaFin: propuesta.getProjectEndDate()                // CORREGIDO
                        },
                        empresa: {
                            nombre: propuesta.getCompanyShortName(),               // CORREGIDO
                            sector: propuesta.getContactArea(),                    // CORREGIDO
                            personaContacto: propuesta.getContactName(),           // CORREGIDO
                            paginaWeb: propuesta.getCompanyWebsite()               // CORREGIDO
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
