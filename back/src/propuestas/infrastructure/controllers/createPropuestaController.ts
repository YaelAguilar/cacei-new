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
            
            // Información de la empresa
            companyShortName,
            companyLegalName,
            companyTaxId,
            
            // Dirección de la empresa
            companyState,
            companyMunicipality,
            companySettlementType,
            companySettlementName,
            companyStreetType,
            companyStreetName,
            companyExteriorNumber,
            companyInteriorNumber,
            companyPostalCode,
            companyWebsite,
            companyLinkedin,
            
            // Información de contacto
            contactName,
            contactPosition,
            contactEmail,
            contactPhone,
            contactArea,
            
            // Supervisor del proyecto
            supervisorName,
            supervisorArea,
            supervisorEmail,
            supervisorPhone,
            
            // Datos del proyecto
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

            // Validar campos requeridos básicos
            console.log('🔍 Validando campos requeridos...');
            if (!academicTutorId || !internshipType || !companyShortName || !companyLegalName || 
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
                
                // Información de la empresa
                companyShortName,
                companyLegalName,
                companyTaxId,
                
                // Dirección
                companyState,
                companyMunicipality,
                companySettlementType,
                companySettlementName,
                companyStreetType,
                companyStreetName,
                companyExteriorNumber,
                companyInteriorNumber,
                companyPostalCode,
                companyWebsite,
                companyLinkedin,
                
                // Contacto
                contactName,
                contactPosition,
                contactEmail,
                contactPhone,
                contactArea,
                
                // Supervisor
                supervisorName,
                supervisorArea,
                supervisorEmail,
                supervisorPhone,
                
                // Proyecto
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
                // Formatear respuesta completa
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
}