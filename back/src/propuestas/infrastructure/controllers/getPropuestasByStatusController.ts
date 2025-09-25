// src/propuestas/infrastructure/controllers/getPropuestasByStatusController.ts
import { Request, Response } from 'express';
import { GetPropuestasByStatusUseCase } from '../../application/getPropuestasByStatusUseCase';
import { ProposalStatus } from '../../domain/models/propuesta';

export class GetPropuestasByStatusController {
    constructor(private readonly getPropuestasByStatusUseCase: GetPropuestasByStatusUseCase) {}

    async run(req: Request, res: Response): Promise<void> {
        const { status } = req.params;

        try {
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
            const statusUpper = status.toUpperCase() as ProposalStatus;
            
            if (!validStatuses.includes(statusUpper)) {
                res.status(400).json({
                    errors: [{
                        status: "400",
                        title: "Bad Request",
                        detail: "Estatus inválido. Los valores válidos son: PENDIENTE, APROBADO, RECHAZADO, ACTUALIZAR"
                    }]
                });
                return;
            }

            const propuestas = await this.getPropuestasByStatusUseCase.run(statusUpper);

            const formattedPropuestas = propuestas ? propuestas.map(propuesta => this.formatPropuestaResponse(propuesta)) : [];

            res.status(200).json({
                data: formattedPropuestas,
                meta: {
                    total: formattedPropuestas.length,
                    status: statusUpper
                }
            });
        } catch (error) {
            console.error("Error in GetPropuestasByStatusController:", error);

            if (error instanceof Error) {
                const errorMessage = error.message;
                
                if (errorMessage.includes("Estatus de propuesta inválido")) {
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

    private formatPropuestaResponse(propuesta: any) {
        return {
            type: "propuesta",
            id: propuesta.getUuid(),
            attributes: {
                // Estatus de la propuesta
                estatus: propuesta.getProposalStatus(),
                
                // Información del alumno (sección) - ACTUALIZADA
                informacionDelAlumno: {
                    // NUEVOS CAMPOS: Información del estudiante
                    nombreCompleto: propuesta.getStudentName(),
                    email: propuesta.getStudentEmail(),
                    // Tutor académico (subsección)
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