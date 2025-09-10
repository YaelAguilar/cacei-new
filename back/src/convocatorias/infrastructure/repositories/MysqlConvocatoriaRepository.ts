import { ConvocatoriaRepository } from "../../domain/interfaces/convocatoriaRepository";
import { Convocatoria } from "../../domain/models/convocatoria";
import { Profesor } from "../../domain/models/profesor";
import { query } from "../../../database/mysql";
import { v4 as uuidv4 } from 'uuid';

export class MysqlConvocatoriaRepository implements ConvocatoriaRepository {
    
    async createConvocatoria(
        nombre: string,
        descripcion: string | null,
        fechaLimite: Date,
        pasantiasDisponibles: string[],
        profesoresDisponibles: { id: number; nombre: string; email: string }[]
    ): Promise<Convocatoria | null> {
        const sql = `
            INSERT INTO convocatorias (uuid, nombre, descripcion, fecha_limite, pasantias_disponibles, profesores_disponibles) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const uuid = uuidv4();
        const params: any[] = [
            uuid,
            nombre,
            descripcion,
            fechaLimite,
            JSON.stringify(pasantiasDisponibles),
            JSON.stringify(profesoresDisponibles)
        ];

        try {
            const result: any = await query(sql, params);
            return new Convocatoria(
                result.insertId,
                nombre,
                descripcion,
                fechaLimite,
                pasantiasDisponibles,
                profesoresDisponibles,
                uuid,
                true,
                new Date(),
                new Date()
            );
        } catch (error) {
            console.error("Error creating convocatoria:", error);
            throw new Error(`Error al crear la convocatoria: ${error}`);
        }
    }

    async getConvocatorias(): Promise<Convocatoria[] | null> {
        const sql = `
            SELECT * FROM convocatorias 
            WHERE active = true 
            ORDER BY created_at DESC
        `;

        try {
            const result: any = await query(sql);
            
            if (result.length > 0) {
                return result.map((row: any) => new Convocatoria(
                    row.id,
                    row.nombre,
                    row.descripcion,
                    new Date(row.fecha_limite),
                    JSON.parse(row.pasantias_disponibles),
                    JSON.parse(row.profesores_disponibles),
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
            console.error("Error getting convocatorias:", error);
            throw new Error(`Error al obtener las convocatorias: ${error}`);
        }
    }

    async getConvocatoria(uuid: string): Promise<Convocatoria | null> {
        const sql = `SELECT * FROM convocatorias WHERE uuid = ? AND active = true`;
        const params: any[] = [uuid];

        try {
            const result: any = await query(sql, params);
            
            if (result.length > 0) {
                const row = result[0];
                return new Convocatoria(
                    row.id,
                    row.nombre,
                    row.descripcion,
                    new Date(row.fecha_limite),
                    JSON.parse(row.pasantias_disponibles),
                    JSON.parse(row.profesores_disponibles),
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
            console.error("Error getting convocatoria:", error);
            throw new Error(`Error al obtener la convocatoria: ${error}`);
        }
    }

    async updateConvocatoria(
        uuid: string,
        updatedData: Partial<{
            nombre: string;
            descripcion: string | null;
            fechaLimite: Date;
            pasantiasDisponibles: string[];
            profesoresDisponibles: { id: number; nombre: string; email: string }[];
        }>
    ): Promise<Convocatoria | null> {
        const fields: string[] = [];
        const params: any[] = [];

        if (updatedData.nombre !== undefined) {
            fields.push("nombre = ?");
            params.push(updatedData.nombre);
        }

        if (updatedData.descripcion !== undefined) {
            fields.push("descripcion = ?");
            params.push(updatedData.descripcion);
        }

        if (updatedData.fechaLimite !== undefined) {
            fields.push("fecha_limite = ?");
            params.push(updatedData.fechaLimite);
        }

        if (updatedData.pasantiasDisponibles !== undefined) {
            fields.push("pasantias_disponibles = ?");
            params.push(JSON.stringify(updatedData.pasantiasDisponibles));
        }

        if (updatedData.profesoresDisponibles !== undefined) {
            fields.push("profesores_disponibles = ?");
            params.push(JSON.stringify(updatedData.profesoresDisponibles));
        }

        if (fields.length === 0) {
            throw new Error("No hay campos para actualizar");
        }

        fields.push("updated_at = CURRENT_TIMESTAMP");
        params.push(uuid);

        const sql = `UPDATE convocatorias SET ${fields.join(", ")} WHERE uuid = ? AND active = true`;

        try {
            const result: any = await query(sql, params);
            
            if (result.affectedRows === 0) {
                return null;
            }

            // Obtener la convocatoria actualizada
            return await this.getConvocatoria(uuid);
        } catch (error) {
            console.error("Error updating convocatoria:", error);
            throw new Error(`Error al actualizar la convocatoria: ${error}`);
        }
    }

    async getProfesoresDisponibles(): Promise<Profesor[] | null> {
        const sql = `
            SELECT DISTINCT u.id, 
                   CONCAT(u.name, ' ', u.lastName, ' ', IFNULL(u.secondLastName, '')) as nombre,
                   u.email
            FROM users u
            INNER JOIN role_users ru ON u.id = ru.id_user
            INNER JOIN roles r ON ru.id_role = r.id
            WHERE u.active = true 
            AND ru.active = true 
            AND r.active = true
            AND r.name IN ('PTC', 'Director')
            ORDER BY nombre
        `;

        try {
            const result: any = await query(sql);
            
            if (result.length > 0) {
                return result.map((row: any) => new Profesor(
                    row.id,
                    row.nombre,
                    row.email
                ));
            }
            return [];
        } catch (error) {
            console.error("Error getting profesores disponibles:", error);
            throw new Error(`Error al obtener los profesores disponibles: ${error}`);
        }
    }

    async deactivateExpiredConvocatorias(): Promise<void> {
        const sql = `
            UPDATE convocatorias 
            SET active = false, updated_at = CURRENT_TIMESTAMP
            WHERE fecha_limite < NOW() AND active = true
        `;

        try {
            const result: any = await query(sql);
            if (result.affectedRows > 0) {
                console.log(`Se desactivaron ${result.affectedRows} convocatorias expiradas`);
            }
        } catch (error) {
            console.error("Error deactivating expired convocatorias:", error);
            throw new Error(`Error al desactivar convocatorias expiradas: ${error}`);
        }
    }

    async hasActiveConvocatoria(): Promise<boolean> {
        const sql = `
            SELECT COUNT(*) as count 
            FROM convocatorias 
            WHERE active = true AND fecha_limite >= NOW()
        `;

        try {
            const result: any = await query(sql);
            return result[0].count > 0;
        } catch (error) {
            console.error("Error checking active convocatoria:", error);
            throw new Error(`Error al verificar convocatoria activa: ${error}`);
        }
    }
}