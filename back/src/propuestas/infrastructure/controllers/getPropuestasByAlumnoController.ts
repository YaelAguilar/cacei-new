import { Request, Response } from 'express';
import { GetPropuestasByAlumnoUseCase } from '../../application/getPropuestasUseCase';

export class GetPropuestasByAlumnoController {
    constructor(private readonly getPropuestasByAlumnoUseCase: GetPropuestasByAlumnoUseCase) {}

    async run(req: Request, res: Response): Promise<void> {
        console.log('🏁 GetPropuestasByAlumnoController iniciado');
        
        try {
            // Obtener el ID del alumno del token JWT
            console.log('🔍 Verificando token...');
            const userFromToken = (req as any).user;
            console.log('👤 UserFromToken:', userFromToken);
            
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

            // Obtener el ID del alumno desde la base de datos usando el UUID del token
            console.log('🔍 Consultando usuario en BD...');
            const { query } = require('../../../database/mysql');
            console.log('📊 Función query importada:', typeof query);
            
            const userResult = await query('SELECT id FROM users WHERE uuid = ? AND active = true', [userFromToken.uuid]);
            console.log('👥 Resultado consulta usuario:', userResult);
            
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

            const idAlumno = userResult[0].id;
            console.log('✅ ID del alumno encontrado:', idAlumno);

            console.log('🔍 Ejecutando getPropuestasByAlumnoUseCase...');
            const propuestas = await this.getPropuestasByAlumnoUseCase.run(idAlumno);
            console.log('📋 Propuestas obtenidas:', propuestas ? propuestas.length : 'null');

            // 🔧 DEBUG: Información detallada de las propuestas
            if (propuestas && propuestas.length > 0) {
                console.log('📊 Detalles de propuestas encontradas:');
                propuestas.forEach((propuesta, index) => {
                    console.log(`  Propuesta ${index + 1}:`, {
                        id: propuesta.getId(),
                        idConvocatoria: propuesta.getIdConvocatoria(),
                        tipoIdConvocatoria: typeof propuesta.getIdConvocatoria(),
                        proyecto: propuesta.getNombreProyecto(),
                        empresa: propuesta.getNombreEmpresa(),
                        activa: propuesta.isActive(),
                        fechaCreacion: propuesta.getCreatedAt()
                    });
                });
            } else {
                console.log('📊 No se encontraron propuestas para el alumno ID:', idAlumno);
            }

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

            console.log('✅ Enviando respuesta:', formattedPropuestas.length, 'propuestas');
            console.log('📤 Formato de respuesta para frontend:', {
                propuestasCount: formattedPropuestas.length,
                idConvocatorias: formattedPropuestas.map(p => ({
                    propuestaId: p.id,
                    idConvocatoria: p.attributes.idConvocatoria,
                    tipoIdConvocatoria: typeof p.attributes.idConvocatoria
                }))
            });
            
            res.status(200).json({
                data: formattedPropuestas
            });
            console.log('✅ Respuesta enviada exitosamente');
            
        } catch (error) {
            console.error("❌ Error in GetPropuestasByAlumnoController:", error);
            console.error("Stack trace:", error instanceof Error ? error.stack : 'No stack');
            
            // Asegurarse de que se envía una respuesta
            if (!res.headersSent) {
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
}