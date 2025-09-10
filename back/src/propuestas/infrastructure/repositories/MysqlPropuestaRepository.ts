// src/propuestas/infrastructure/repositories/MysqlPropuestaRepository.ts
import { PropuestaRepository, PropuestaCreateData, PropuestaUpdateData } from "../../domain/interfaces/propuestaRepository";
import { Propuesta } from "../../domain/models/propuesta";
import { query } from "../../../database/mysql";
import { v4 as uuidv4 } from 'uuid';

export class MysqlPropuestaRepository implements PropuestaRepository {

    async createPropuesta(data: PropuestaCreateData): Promise<Propuesta | null> {
        // Primero obtener los datos del tutor académico
        const tutorSql = `
            SELECT 
                CONCAT(u.name, ' ', u.lastName, ' ', IFNULL(u.secondLastName, '')) as nombre_completo,
                u.email
            FROM users u
            WHERE u.id = ? AND u.active = true
        `;
        
        try {
            const tutorResult: any = await query(tutorSql, [data.tutorAcademicoId]);
            if (tutorResult.length === 0) {
                throw new Error("Tutor académico no encontrado o inactivo");
            }

            const tutor = tutorResult[0];

            const sql = `
                INSERT INTO propuestas (
                    uuid, id_convocatoria, id_alumno, tutor_academico_id, tutor_academico_nombre, 
                    tutor_academico_email, tipo_pasantia, nombre_proyecto, descripcion_proyecto,
                    entregables, tecnologias, supervisor_proyecto, actividades, fecha_inicio,
                    fecha_fin, nombre_empresa, sector_empresa, persona_contacto, pagina_web_empresa
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const uuid = uuidv4();
            const params: any[] = [
                uuid,
                data.idConvocatoria,
                data.idAlumno,
                data.tutorAcademicoId,
                tutor.nombre_completo,
                tutor.email,
                data.tipoPasantia,
                data.nombreProyecto,
                data.descripcionProyecto,
                data.entregables,
                data.tecnologias,
                data.supervisorProyecto,
                data.actividades,
                data.fechaInicio,
                data.fechaFin,
                data.nombreEmpresa,
                data.sectorEmpresa,
                data.personaContacto,
                data.paginaWebEmpresa
            ];

            const result: any = await query(sql, params);
            
            return new Propuesta(
                result.insertId,
                data.idConvocatoria,
                data.idAlumno,
                data.tutorAcademicoId,
                tutor.nombre_completo,
                tutor.email,
                data.tipoPasantia,
                data.nombreProyecto,
                data.descripcionProyecto,
                data.entregables,
                data.tecnologias,
                data.supervisorProyecto,
                data.actividades,
                data.fechaInicio,
                data.fechaFin,
                data.nombreEmpresa,
                data.sectorEmpresa,
                data.personaContacto,
                data.paginaWebEmpresa,
                uuid,
                true,
                new Date(),
                new Date()
            );
        } catch (error) {
            console.error("Error creating propuesta:", error);
            throw new Error(`Error al crear la propuesta: ${error}`);
        }
    }

    async getPropuestas(): Promise<Propuesta[] | null> {
        const sql = `
            SELECT * FROM propuestas 
            WHERE active = true 
            ORDER BY created_at DESC
        `;

        try {
            const result: any = await query(sql);
            
            if (result.length > 0) {
                return result.map((row: any) => new Propuesta(
                    row.id,
                    row.id_convocatoria,
                    row.id_alumno,
                    row.tutor_academico_id,
                    row.tutor_academico_nombre,
                    row.tutor_academico_email,
                    row.tipo_pasantia,
                    row.nombre_proyecto,
                    row.descripcion_proyecto,
                    row.entregables,
                    row.tecnologias,
                    row.supervisor_proyecto,
                    row.actividades,
                    new Date(row.fecha_inicio),
                    new Date(row.fecha_fin),
                    row.nombre_empresa,
                    row.sector_empresa,
                    row.persona_contacto,
                    row.pagina_web_empresa,
                    row.uuid,
                    row.active,
                    row.created_at,
                    row.updated_at,
                    row.user_creation,
                    row.user_update
                ));
            }
            return [];
        } catch (error) {
            console.error("Error getting propuestas:", error);
            throw new Error(`Error al obtener las propuestas: ${error}`);
        }
    }

    async getPropuestasByConvocatoria(convocatoriaId: number): Promise<Propuesta[] | null> {
        const sql = `
            SELECT * FROM propuestas 
            WHERE id_convocatoria = ? AND active = true 
            ORDER BY created_at DESC
        `;

        try {
            const result: any = await query(sql, [convocatoriaId]);
            
            if (result.length > 0) {
                return result.map((row: any) => new Propuesta(
                    row.id,
                    row.id_convocatoria,
                    row.id_alumno,
                    row.tutor_academico_id,
                    row.tutor_academico_nombre,
                    row.tutor_academico_email,
                    row.tipo_pasantia,
                    row.nombre_proyecto,
                    row.descripcion_proyecto,
                    row.entregables,
                    row.tecnologias,
                    row.supervisor_proyecto,
                    row.actividades,
                    new Date(row.fecha_inicio),
                    new Date(row.fecha_fin),
                    row.nombre_empresa,
                    row.sector_empresa,
                    row.persona_contacto,
                    row.pagina_web_empresa,
                    row.uuid,
                    row.active,
                    row.created_at,
                    row.updated_at,
                    row.user_creation,
                    row.user_update
                ));
            }
            return [];
        } catch (error) {
            console.error("Error getting propuestas by convocatoria:", error);
            throw new Error(`Error al obtener las propuestas por convocatoria: ${error}`);
        }
    }

    async getPropuestasByAlumno(alumnoId: number): Promise<Propuesta[] | null> {
        const sql = `
            SELECT * FROM propuestas 
            WHERE id_alumno = ? AND active = true 
            ORDER BY created_at DESC
        `;

        try {
            const result: any = await query(sql, [alumnoId]);
            
            if (result.length > 0) {
                return result.map((row: any) => new Propuesta(
                    row.id,
                    row.id_convocatoria,
                    row.id_alumno,
                    row.tutor_academico_id,
                    row.tutor_academico_nombre,
                    row.tutor_academico_email,
                    row.tipo_pasantia,
                    row.nombre_proyecto,
                    row.descripcion_proyecto,
                    row.entregables,
                    row.tecnologias,
                    row.supervisor_proyecto,
                    row.actividades,
                    new Date(row.fecha_inicio),
                    new Date(row.fecha_fin),
                    row.nombre_empresa,
                    row.sector_empresa,
                    row.persona_contacto,
                    row.pagina_web_empresa,
                    row.uuid,
                    row.active,
                    row.created_at,
                    row.updated_at,
                    row.user_creation,
                    row.user_update
                ));
            }
            return [];
        } catch (error) {
            console.error("Error getting propuestas by alumno:", error);
            throw new Error(`Error al obtener las propuestas del alumno: ${error}`);
        }
    }

    async getPropuesta(uuid: string): Promise<Propuesta | null> {
        const sql = `SELECT * FROM propuestas WHERE uuid = ? AND active = true`;
        
        try {
            const result: any = await query(sql, [uuid]);
            
            if (result.length > 0) {
                const row = result[0];
                return new Propuesta(
                    row.id,
                    row.id_convocatoria,
                    row.id_alumno,
                    row.tutor_academico_id,
                    row.tutor_academico_nombre,
                    row.tutor_academico_email,
                    row.tipo_pasantia,
                    row.nombre_proyecto,
                    row.descripcion_proyecto,
                    row.entregables,
                    row.tecnologias,
                    row.supervisor_proyecto,
                    row.actividades,
                    new Date(row.fecha_inicio),
                    new Date(row.fecha_fin),
                    row.nombre_empresa,
                    row.sector_empresa,
                    row.persona_contacto,
                    row.pagina_web_empresa,
                    row.uuid,
                    row.active,
                    row.created_at,
                    row.updated_at,
                    row.user_creation,
                    row.user_update
                );
            }
            return null;
        } catch (error) {
            console.error("Error getting propuesta:", error);
            throw new Error(`Error al obtener la propuesta: ${error}`);
        }
    }

    async updatePropuesta(uuid: string, data: PropuestaUpdateData): Promise<Propuesta | null> {
        const fields: string[] = [];
        const params: any[] = [];

        // Si se actualiza el tutor académico, obtener sus datos
        if (data.tutorAcademicoId !== undefined) {
            const tutorSql = `
                SELECT 
                    CONCAT(u.name, ' ', u.lastName, ' ', IFNULL(u.secondLastName, '')) as nombre_completo,
                    u.email
                FROM users u
                WHERE u.id = ? AND u.active = true
            `;
            
            const tutorResult: any = await query(tutorSql, [data.tutorAcademicoId]);
            if (tutorResult.length === 0) {
                throw new Error("Tutor académico no encontrado o inactivo");
            }

            const tutor = tutorResult[0];
            fields.push("tutor_academico_id = ?", "tutor_academico_nombre = ?", "tutor_academico_email = ?");
            params.push(data.tutorAcademicoId, tutor.nombre_completo, tutor.email);
        }

        if (data.tipoPasantia !== undefined) {
            fields.push("tipo_pasantia = ?");
            params.push(data.tipoPasantia);
        }

        if (data.nombreProyecto !== undefined) {
            fields.push("nombre_proyecto = ?");
            params.push(data.nombreProyecto);
        }

        if (data.descripcionProyecto !== undefined) {
            fields.push("descripcion_proyecto = ?");
            params.push(data.descripcionProyecto);
        }

        if (data.entregables !== undefined) {
            fields.push("entregables = ?");
            params.push(data.entregables);
        }

        if (data.tecnologias !== undefined) {
            fields.push("tecnologias = ?");
            params.push(data.tecnologias);
        }

        if (data.supervisorProyecto !== undefined) {
            fields.push("supervisor_proyecto = ?");
            params.push(data.supervisorProyecto);
        }

        if (data.actividades !== undefined) {
            fields.push("actividades = ?");
            params.push(data.actividades);
        }

        if (data.fechaInicio !== undefined) {
            fields.push("fecha_inicio = ?");
            params.push(data.fechaInicio);
        }

        if (data.fechaFin !== undefined) {
            fields.push("fecha_fin = ?");
            params.push(data.fechaFin);
        }

        if (data.nombreEmpresa !== undefined) {
            fields.push("nombre_empresa = ?");
            params.push(data.nombreEmpresa);
        }

        if (data.sectorEmpresa !== undefined) {
            fields.push("sector_empresa = ?");
            params.push(data.sectorEmpresa);
        }

        if (data.personaContacto !== undefined) {
            fields.push("persona_contacto = ?");
            params.push(data.personaContacto);
        }

        if (data.paginaWebEmpresa !== undefined) {
            fields.push("pagina_web_empresa = ?");
            params.push(data.paginaWebEmpresa);
        }

        if (fields.length === 0) {
            throw new Error("No hay campos para actualizar");
        }

        fields.push("updated_at = CURRENT_TIMESTAMP");
        params.push(uuid);

        const sql = `UPDATE propuestas SET ${fields.join(", ")} WHERE uuid = ? AND active = true`;

        try {
            const result: any = await query(sql, params);
            
            if (result.affectedRows === 0) {
                return null;
            }

            // Obtener la propuesta actualizada
            return await this.getPropuesta(uuid);
        } catch (error) {
            console.error("Error updating propuesta:", error);
            throw new Error(`Error al actualizar la propuesta: ${error}`);
        }
    }

    async checkExistingPropuesta(alumnoId: number, convocatoriaId: number): Promise<boolean> {
        const sql = `
            SELECT COUNT(*) as count 
            FROM propuestas 
            WHERE id_alumno = ? AND id_convocatoria = ? AND active = true
        `;

        try {
            const result: any = await query(sql, [alumnoId, convocatoriaId]);
            return result[0].count > 0;
        } catch (error) {
            console.error("Error checking existing propuesta:", error);
            throw new Error(`Error al verificar propuesta existente: ${error}`);
        }
    }

    async getActiveConvocatoria(): Promise<{ id: number; uuid: string; nombre: string; pasantiasDisponibles: string[]; profesoresDisponibles: any[] } | null> {
        const sql = `
            SELECT id, uuid, nombre, pasantias_disponibles, profesores_disponibles
            FROM convocatorias 
            WHERE active = true AND fecha_limite >= NOW()
            ORDER BY created_at DESC
            LIMIT 1
        `;

        try {
            const result: any = await query(sql);
            
            if (result.length > 0) {
                const row = result[0];
                return {
                    id: row.id,
                    uuid: row.uuid,
                    nombre: row.nombre,
                    pasantiasDisponibles: row.pasantias_disponibles,
                    profesoresDisponibles: row.profesores_disponibles
                };
            }
            return null;
        } catch (error) {
            console.error("Error getting active convocatoria:", error);
            throw new Error(`Error al obtener la convocatoria activa: ${error}`);
        }
    }
}