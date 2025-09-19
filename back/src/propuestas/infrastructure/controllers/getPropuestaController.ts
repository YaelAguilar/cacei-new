// back/src/propuestas/infrastructure/controllers/getPropuestaController.ts
import { Request, Response } from 'express';
import { GetPropuestaUseCase } from '../../application/getPropuestaUseCase';

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
                        
                        // Tutor Académico
                        tutorAcademico: {
                            id: propuesta.getAcademicTutorId(),
                            nombre: propuesta.getAcademicTutorName(),
                            email: propuesta.getAcademicTutorEmail()
                        },
                        
                        // Tipo de pasantía
                        tipoPasantia: propuesta.getInternshipType(),
                        
                        // Información completa de la empresa
                        empresa: {
                            nombreCorto: propuesta.getCompanyShortName(),
                            razonSocial: propuesta.getCompanyLegalName(),
                            rfc: propuesta.getCompanyTaxId(),
                            direccion: {
                                estado: propuesta.getCompanyState(),
                                municipio: propuesta.getCompanyMunicipality(),
                                tipoAsentamiento: propuesta.getCompanySettlementType(),
                                nombreAsentamiento: propuesta.getCompanySettlementName(),
                                tipoVialidad: propuesta.getCompanyStreetType(),
                                nombreVia: propuesta.getCompanyStreetName(),
                                numeroExterior: propuesta.getCompanyExteriorNumber(),
                                numeroInterior: propuesta.getCompanyInteriorNumber(),
                                codigoPostal: propuesta.getCompanyPostalCode()
                            },
                            paginaWeb: propuesta.getCompanyWebsite(),
                            linkedin: propuesta.getCompanyLinkedin(),
                            sector: propuesta.getContactArea() // Para compatibilidad
                        },
                        
                        // Información de contacto
                        contacto: {
                            nombre: propuesta.getContactName(),
                            puesto: propuesta.getContactPosition(),
                            email: propuesta.getContactEmail(),
                            telefono: propuesta.getContactPhone(),
                            area: propuesta.getContactArea()
                        },
                        
                        // Supervisor del proyecto
                        supervisor: {
                            nombre: propuesta.getSupervisorName(),
                            area: propuesta.getSupervisorArea(),
                            email: propuesta.getSupervisorEmail(),
                            telefono: propuesta.getSupervisorPhone()
                        },
                        
                        // Proyecto completo
                        proyecto: {
                            nombre: propuesta.getProjectName(),
                            fechaInicio: propuesta.getProjectStartDate(),
                            fechaFin: propuesta.getProjectEndDate(),
                            contextoProblema: propuesta.getProjectProblemContext(),
                            descripcionProblema: propuesta.getProjectProblemDescription(),
                            objetivoGeneral: propuesta.getProjectGeneralObjective(),
                            objetivosEspecificos: propuesta.getProjectSpecificObjectives(),
                            actividadesPrincipales: propuesta.getProjectMainActivities(),
                            entregablesPlaneados: propuesta.getProjectPlannedDeliverables(),
                            tecnologias: propuesta.getProjectTechnologies()
                        },
                        
                        // Metadata
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