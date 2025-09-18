import { Request, Response } from 'express';
import { GetPropuestasUseCase } from '../../application/getPropuestasUseCase';

export class GetPropuestasController {
    constructor(private readonly getPropuestasUseCase: GetPropuestasUseCase) {}

    async run(req: Request, res: Response): Promise<void> {
        try {
            const propuestas = await this.getPropuestasUseCase.run();

            const formattedPropuestas = propuestas ? propuestas.map(propuesta => ({
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
            })) : [];

            res.status(200).json({
                data: formattedPropuestas
            });
        } catch (error) {
            console.error("Error in GetPropuestasController:", error);
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