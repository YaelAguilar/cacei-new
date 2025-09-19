// back/src/propuestas/infrastructure/controllers/updatePropuestaController.ts
import { Request, Response } from 'express';
import { UpdatePropuestaUseCase } from '../../application/updatePropuestaUseCase';

export class UpdatePropuestaController {
    constructor(private readonly updatePropuestaUseCase: UpdatePropuestaUseCase) {}

    async run(req: Request, res: Response): Promise<void> {
        const { uuid } = req.params;
        const updateData = req.body;

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

            // Convertir fechas si están presentes
            if (updateData.projectStartDate) {
                updateData.projectStartDate = new Date(updateData.projectStartDate);
                if (isNaN(updateData.projectStartDate.getTime())) {
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

            if (updateData.projectEndDate) {
                updateData.projectEndDate = new Date(updateData.projectEndDate);
                if (isNaN(updateData.projectEndDate.getTime())) {
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

            const propuesta = await this.updatePropuestaUseCase.run(uuid, updateData);

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
                    "No hay campos para actualizar",
                    "debe tener una duración mínima"
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