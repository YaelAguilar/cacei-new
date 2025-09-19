// back/src/propuestas/infrastructure/controllers/getPropuestasController.ts
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
                        sector: propuesta.getContactArea()
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