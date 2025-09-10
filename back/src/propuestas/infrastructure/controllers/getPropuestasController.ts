// src/propuestas/infrastructure/controllers/getPropuestasController.ts
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