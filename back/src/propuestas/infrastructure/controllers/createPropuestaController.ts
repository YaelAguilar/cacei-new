// back/src/propuestas/infrastructure/controllers/createPropuestaController.ts
import { Request, Response } from 'express';
import { CreatePropuestaUseCase } from '../../application/createPropuestaUseCase';

export class CreatePropuestaController {
    constructor(private readonly createPropuestaUseCase: CreatePropuestaUseCase) {}

    async run(req: Request, res: Response): Promise<void> {
        console.log('🏁 CreatePropuestaController iniciado');
        console.log('📝 Body recibido:', req.body);
        
        const {
            academicTutorId,
            internshipType,
            
            // Información de la empresa (sección)
            companyShortName, // OPCIONAL
            companyLegalName,
            companyTaxId,
            
            // Dirección física y en la web de la empresa (sección)
            companyState,
            companyMunicipality,
            companySettlementType,
            companySettlementName,
            companyStreetType,
            companyStreetName,
            companyExteriorNumber,
            companyInteriorNumber, // OPCIONAL
            companyPostalCode,
            companyWebsite, // OPCIONAL
            companyLinkedin, // OPCIONAL
            
            // Información de contacto en la empresa (sección)
            contactName,
            contactPosition,
            contactEmail,
            contactPhone,
            contactArea,
            
            // Supervisor del proyecto (sección)
            supervisorName,
            supervisorArea,
            supervisorEmail,
            supervisorPhone,
            
            // Datos del proyecto (sección)
            projectName,
            projectStartDate,
            projectEndDate,
            projectProblemContext,
            projectProblemDescription,
            projectGeneralObjective,
            projectSpecificObjectives,
            projectMainActivities,
            projectPlannedDeliverables,
            projectTechnologies
        } = req.body;

        try {
            // Obtener el ID del estudiante del token JWT
            console.log('🔍 Verificando token...');
            const userFromToken = (req as any).user;
            
            if (!userFromToken || !userFromToken.uuid) {
                console.log('❌ Token inválido');
                res.status(401).json({
                    errors: [{
                        status: "401",
                        title: "Unauthorized",
                        detail: "Token de usuario inválido"
                    }]
                });
                return;
            }

            console.log('✅ Token válido, UUID:', userFromToken.uuid);

            // Obtener el ID del estudiante desde la base de datos usando el UUID del token
            console.log('🔍 Consultando usuario en BD...');
            const { query } = require('../../../database/mysql');
            const userResult = await query('SELECT id FROM users WHERE uuid = ? AND active = true', [userFromToken.uuid]);
            
            if (userResult.length === 0) {
                console.log('❌ Usuario no encontrado en BD');
                res.status(404).json({
                    errors: [{
                        status: "404",
                        title: "User not found",
                        detail: "Usuario no encontrado"
                    }]
                });
                return;
            }

            const studentId = userResult[0].id;
            console.log('✅ ID del estudiante encontrado:', studentId);

            // Validar campos requeridos básicos (sin incluir los opcionales)
            console.log('🔍 Validando campos requeridos...');
            if (!academicTutorId || !internshipType || !companyLegalName || 
                !companyTaxId || !companyState || !companyMunicipality || !projectName || 
                !contactName || !supervisorName) {
                console.log('❌ Faltan campos requeridos básicos');
                res.status(400).json({
                    errors: [{
                        status: "400",
                        title: "Bad Request",
                        detail: "Faltan campos obligatorios básicos"
                    }]
                });
                return;
            }

            console.log('✅ Campos básicos validados');

            // Convertir fechas
            console.log('🔍 Convirtiendo fechas...');
            const startDate = new Date(projectStartDate);
            const endDate = new Date(projectEndDate);
            
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                console.log('❌ Formato de fechas inválido');
                res.status(400).json({
                    errors: [{
                        status: "400",
                        title: "Bad Request",
                        detail: "Formato de fechas inválido"
                    }]
                });
                return;
            }

            console.log('✅ Fechas convertidas exitosamente');

            console.log('🔍 Ejecutando createPropuestaUseCase...');
            const propuesta = await this.createPropuestaUseCase.run(
                studentId,
                academicTutorId,
                internshipType,
                
                // Información de la empresa (sección) - manejo de campos opcionales
                companyShortName || null, // OPCIONAL
                companyLegalName,
                companyTaxId,
                
                // Dirección física y en la web de la empresa (sección)
                companyState,
                companyMunicipality,
                companySettlementType,
                companySettlementName,
                companyStreetType,
                companyStreetName,
                companyExteriorNumber,
                companyInteriorNumber || null, // OPCIONAL
                companyPostalCode,
                companyWebsite || null, // OPCIONAL
                companyLinkedin || null, // OPCIONAL
                
                // Información de contacto en la empresa (sección)
                contactName,
                contactPosition,
                contactEmail,
                contactPhone,
                contactArea,
                
                // Supervisor del proyecto (sección)
                supervisorName,
                supervisorArea,
                supervisorEmail,
                supervisorPhone,
                
                // Datos del proyecto (sección)
                projectName,
                startDate,
                endDate,
                projectProblemContext,
                projectProblemDescription,
                projectGeneralObjective,
                projectSpecificObjectives,
                projectMainActivities,
                projectPlannedDeliverables,
                projectTechnologies,
                
                studentId // userCreation
            );

            console.log('📋 Propuesta creada:', propuesta ? 'exitosamente' : 'falló');

            if (propuesta) {
                // Formatear respuesta con estructura de secciones y subsecciones
                const formattedPropuesta = this.formatPropuestaResponse(propuesta);

                console.log('✅ Enviando respuesta exitosa');
                res.status(201).json({ data: formattedPropuesta });
            } else {
                console.log('❌ No se pudo crear la propuesta');
                res.status(400).json({
                    errors: [{
                        status: "400",
                        title: "Could not create propuesta",
                        detail: "No se pudo crear la propuesta"
                    }]
                });
            }
        } catch (error) {
            console.error("❌ Error in CreatePropuestaController:", error);
            console.error("Stack trace:", error instanceof Error ? error.stack : 'No stack');
            
            if (error instanceof Error) {
                const errorMessage = error.message;
                
                const businessErrors = [
                    "No hay una convocatoria activa disponible",
                    "Ya tienes una propuesta registrada en la convocatoria actual",
                    "es obligatorio",
                    "no puede ser anterior",
                    "debe ser posterior",
                    "no está disponible en la convocatoria actual",
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
            
            if (!res.headersSent) {
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

    private formatPropuestaResponse(propuesta: any) {
        return {
            type: "propuesta",
            id: propuesta.getUuid(),
            attributes: {
                // Estatus de la propuesta
                estatus: propuesta.getProposalStatus(),
                
                // Información del alumno (sección)
                informacionDelAlumno: {
                    // Nombre del alumno se obtiene de la relación con users
                    tutorAcademico: { // tutor académico (subsección)
                        id: propuesta.getAcademicTutorId(),
                        nombre: propuesta.getAcademicTutorName(),
                        email: propuesta.getAcademicTutorEmail()
                    },
                    pasantiaARealizar: propuesta.getInternshipType() // Pasantía a realizar (subsección)
                },
                
                // Información de la empresa (sección)
                informacionDeLaEmpresa: {
                    nombreCorto: propuesta.getCompanyShortName(), // OPCIONAL
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
                    numeroInterior: propuesta.getCompanyInteriorNumber(), // OPCIONAL
                    codigoPostal: propuesta.getCompanyPostalCode(),
                    paginaWeb: propuesta.getCompanyWebsite(), // OPCIONAL
                    linkedin: propuesta.getCompanyLinkedin() // OPCIONAL
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
                updatedAt: propuesta.getUpdatedAt(),
                
                // Mantener formato anterior para compatibilidad
                tutorAcademico: {
                    id: propuesta.getAcademicTutorId(),
                    nombre: propuesta.getAcademicTutorName(),
                    email: propuesta.getAcademicTutorEmail()
                },
                tipoPasantia: propuesta.getInternshipType(),
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
                contacto: {
                    nombre: propuesta.getContactName(),
                    puesto: propuesta.getContactPosition(),
                    email: propuesta.getContactEmail(),
                    telefono: propuesta.getContactPhone(),
                    area: propuesta.getContactArea()
                },
                supervisor: {
                    nombre: propuesta.getSupervisorName(),
                    area: propuesta.getSupervisorArea(),
                    email: propuesta.getSupervisorEmail(),
                    telefono: propuesta.getSupervisorPhone()
                },
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
                }
            }
        };
    }
}