// src/propuestas/infrastructure/controllers/updateProposalStatusController.ts
import { Request, Response } from 'express';
import { UpdateProposalStatusUseCase } from '../../application/updateProposalStatusUseCase';
import { ProposalStatus } from '../../domain/models/propuesta';

export class UpdateProposalStatusController {
    constructor(private readonly updateProposalStatusUseCase: UpdateProposalStatusUseCase) {}

    async run(req: Request, res: Response): Promise<void> {
        const { uuid } = req.params;
        const { status } = req.body;

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

            if (!status) {
                res.status(400).json({
                    errors: [{
                        status: "400",
                        title: "Bad Request", 
                        detail: "El estatus es obligatorio"
                    }]
                });
                return;
            }

            // Validar que el estatus sea válido
            const validStatuses: ProposalStatus[] = ['PENDIENTE', 'APROBADO', 'RECHAZADO', 'ACTUALIZAR'];
            if (!validStatuses.includes(status)) {
                res.status(400).json({
                    errors: [{
                        status: "400",
                        title: "Bad Request",
                        detail: "Estatus inválido. Los valores válidos son: PENDIENTE, APROBADO, RECHAZADO, ACTUALIZAR"
                    }]
                });
                return;
            }

            // Obtener el usuario que hace la actualización del token
            const userFromToken = (req as any).user;
            const userUpdate = userFromToken?.uuid ? 
                await this.getUserIdFromUuid(userFromToken.uuid) : undefined;

            const propuesta = await this.updateProposalStatusUseCase.run(uuid, status, userUpdate);

            if (propuesta) {
                const formattedPropuesta = this.formatPropuestaResponse(propuesta);
                res.status(200).json({ data: formattedPropuesta });
            } else {
                res.status(404).json({
                    errors: [{
                        status: "404",
                        title: "Propuesta not found",
                        detail: "No se encontró la propuesta o no se pudo actualizar el estatus"
                    }]
                });
            }
        } catch (error) {
            console.error("Error in UpdateProposalStatusController:", error);
            
            if (error instanceof Error) {
                const errorMessage = error.message;
                
                const businessErrors = [
                    "Propuesta no encontrada",
                    "Estatus de propuesta inválido"
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

    private async getUserIdFromUuid(uuid: string): Promise<number | undefined> {
        try {
            const { query } = require('../../../database/mysql');
            const result = await query('SELECT id FROM users WHERE uuid = ?', [uuid]);
            return result.length > 0 ? result[0].id : undefined;
        } catch (error) {
            console.error('Error getting user ID from UUID:', error);
            return undefined;
        }
    }

    private formatPropuestaResponse(propuesta: any) {
        return {
            type: "propuesta",
            id: propuesta.getUuid(),
            attributes: {
                // Estatus de la propuesta
                estatus: propuesta.getProposalStatus(),
                
                // Información del alumno (sección)
                informacionDelAlumno: {
                    tutorAcademico: {
                        id: propuesta.getAcademicTutorId(),
                        nombre: propuesta.getAcademicTutorName(),
                        email: propuesta.getAcademicTutorEmail()
                    },
                    pasantiaARealizar: propuesta.getInternshipType()
                },
                
                // Información de la empresa (sección)
                informacionDeLaEmpresa: {
                    nombreCorto: propuesta.getCompanyShortName(),
                    nombreLegal: propuesta.getCompanyLegalName(),
                    rfc: propuesta.getCompanyTaxId()
                },
                
                // Dirección física y en la web de la empresa (sección)
                direccionFisicaYEnLaWebDeLaEmpresa: {
                    entidadFederativa: propuesta.getCompanyState(),
                    demarcacionTerritorial: propuesta.getCompanyMunicipality(),
                    tipoDeAsentamientoHumano: propuesta.getCompanySettlementType(),
                    nombreDelAsentamientoHumano: propuesta.getCompanySettlementName(),
                    vialidad: propuesta.getCompanyStreetType(),
                    nombreDeLaVia: propuesta.getCompanyStreetName(),
                    numeroExterior: propuesta.getCompanyExteriorNumber(),
                    numeroInterior: propuesta.getCompanyInteriorNumber(),
                    codigoPostal: propuesta.getCompanyPostalCode(),
                    paginaWeb: propuesta.getCompanyWebsite(),
                    linkedin: propuesta.getCompanyLinkedin()
                },
                
                // Información de contacto en la empresa (sección)
                informacionDeContactoEnLaEmpresa: {
                    nombreDeLaPersonaDeContacto: propuesta.getContactName(),
                    puestoEnLaEmpresaDeLaPersonaDeContacto: propuesta.getContactPosition(),
                    direccionElectronicaDeCorreo: propuesta.getContactEmail(),
                    numeroTelefonico: propuesta.getContactPhone(),
                    nombreDelAreaAsociada: propuesta.getContactArea()
                },
                
                // Supervisor del proyecto de estancia o estadía (sección)
                supervisorDelProyectoDeEstanciaOEstadia: {
                    nombreDelSupervisor: propuesta.getSupervisorName(),
                    areaDeLaEmpresaEnLaQueSeDesarrollaraElProyecto: propuesta.getSupervisorArea(),
                    direccionElectronicaDeCorreo: propuesta.getSupervisorEmail(),
                    numeroDeTelefono: propuesta.getSupervisorPhone()
                },
                
                // Datos del proyecto (sección)
                datosDelProyecto: {
                    nombreDelProyecto: propuesta.getProjectName(),
                    fechaDeInicioDelProyecto: propuesta.getProjectStartDate(),
                    fechaDeCierreDelProyecto: propuesta.getProjectEndDate(),
                    contextoDeLaProblematica: propuesta.getProjectProblemContext(),
                    problematica: propuesta.getProjectProblemDescription(),
                    objetivoGeneralDelProyectoADesarrollar: propuesta.getProjectGeneralObjective(),
                    objetivosEspecificosDelProyecto: propuesta.getProjectSpecificObjectives(),
                    principalesActividadesARealizarEnLaEstanciaOEstadia: propuesta.getProjectMainActivities(),
                    entregablesPlaneadosDelProyecto: propuesta.getProjectPlannedDeliverables(),
                    tecnologiasAAplicarEnElProyecto: propuesta.getProjectTechnologies()
                },
                
                // Metadata
                active: propuesta.isActive(),
                createdAt: propuesta.getCreatedAt(),
                updatedAt: propuesta.getUpdatedAt()
            }
        };
    }
}