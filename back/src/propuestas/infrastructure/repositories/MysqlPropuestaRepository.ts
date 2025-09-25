import { PropuestaRepository, PropuestaCreateData, PropuestaUpdateData } from "../../domain/interfaces/propuestaRepository";
import { Propuesta, ProposalStatus } from "../../domain/models/propuesta";
import { query } from "../../../database/mysql";
import { v4 as uuidv4 } from 'uuid';

export class MysqlPropuestaRepository implements PropuestaRepository {

    async createPropuesta(data: PropuestaCreateData): Promise<Propuesta | null> {
        const sql = `
            INSERT INTO project_proposals (
                uuid, convocatoria_id, student_id, student_name, student_email,
                academic_tutor_id, academic_tutor_name, academic_tutor_email, internship_type,
                company_short_name, company_legal_name, company_tax_id,
                company_state, company_municipality, company_settlement_type, company_settlement_name,
                company_street_type, company_street_name, company_exterior_number, company_interior_number,
                company_postal_code, company_website, company_linkedin,
                contact_name, contact_position, contact_email, contact_phone, contact_area,
                supervisor_name, supervisor_area, supervisor_email, supervisor_phone,
                project_name, project_start_date, project_end_date, project_problem_context,
                project_problem_description, project_general_objective, project_specific_objectives,
                project_main_activities, project_planned_deliverables, project_technologies,
                proposal_status, user_creation
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const uuid = uuidv4();
        const params: any[] = [
            uuid,
            data.convocatoriaId,
            data.studentId,
            data.studentName, // NUEVO
            data.studentEmail, // NUEVO
            data.academicTutorId,
            data.academicTutorName,
            data.academicTutorEmail,
            data.internshipType,
            data.companyShortName ?? null,
            data.companyLegalName,
            data.companyTaxId,
            data.companyState,
            data.companyMunicipality,
            data.companySettlementType,
            data.companySettlementName,
            data.companyStreetType,
            data.companyStreetName,
            data.companyExteriorNumber,
            data.companyInteriorNumber ?? null,
            data.companyPostalCode,
            data.companyWebsite ?? null,
            data.companyLinkedin ?? null,
            data.contactName,
            data.contactPosition,
            data.contactEmail,
            data.contactPhone,
            data.contactArea,
            data.supervisorName,
            data.supervisorArea,
            data.supervisorEmail,
            data.supervisorPhone,
            data.projectName,
            data.projectStartDate,
            data.projectEndDate,
            data.projectProblemContext,
            data.projectProblemDescription,
            data.projectGeneralObjective,
            data.projectSpecificObjectives,
            data.projectMainActivities,
            data.projectPlannedDeliverables,
            data.projectTechnologies,
            'PENDIENTE', // Por defecto todas las propuestas se crean como PENDIENTE
            data.userCreation
        ];

        try {
            const result: any = await query(sql, params);
            
            return new Propuesta(
                result.insertId,
                uuid,
                data.convocatoriaId,
                data.studentId,
                data.studentName, // NUEVO
                data.studentEmail, // NUEVO
                data.academicTutorId,
                data.academicTutorName,
                data.academicTutorEmail,
                data.internshipType,
                data.companyShortName ?? null,
                data.companyLegalName,
                data.companyTaxId,
                data.companyState,
                data.companyMunicipality,
                data.companySettlementType,
                data.companySettlementName,
                data.companyStreetType,
                data.companyStreetName,
                data.companyExteriorNumber,
                data.companyInteriorNumber ?? null,
                data.companyPostalCode,
                data.companyWebsite ?? null,
                data.companyLinkedin ?? null,
                data.contactName,
                data.contactPosition,
                data.contactEmail,
                data.contactPhone,
                data.contactArea,
                data.supervisorName,
                data.supervisorArea,
                data.supervisorEmail,
                data.supervisorPhone,
                data.projectName,
                data.projectStartDate,
                data.projectEndDate,
                data.projectProblemContext,
                data.projectProblemDescription,
                data.projectGeneralObjective,
                data.projectSpecificObjectives,
                data.projectMainActivities,
                data.projectPlannedDeliverables,
                data.projectTechnologies,
                'PENDIENTE',
                true, // active
                new Date(), // created_at
                new Date(), // updated_at
                data.userCreation,
                null // user_update
            );
        } catch (error) {
            console.error("Error creating propuesta:", error);
            throw new Error(`Error al crear la propuesta: ${error}`);
        }
    }

    async getPropuestas(): Promise<Propuesta[] | null> {
        const sql = `
            SELECT * FROM project_proposals 
            WHERE active = true 
            ORDER BY created_at DESC
        `;

        try {
            const result: any = await query(sql);
            
            if (result.length > 0) {
                return result.map((row: any) => this.mapRowToPropuesta(row));
            }
            return [];
        } catch (error) {
            console.error("Error getting propuestas:", error);
            throw new Error(`Error al obtener las propuestas por estatus: ${error}`);
        }
    }

    async getPropuesta(uuid: string): Promise<Propuesta | null> {
        const sql = `SELECT * FROM project_proposals WHERE uuid = ? AND active = true`;
        
        try {
            const result: any = await query(sql, [uuid]);
            
            if (result.length > 0) {
                return this.mapRowToPropuesta(result[0]);
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

        // INFORMACIÓN DEL ALUMNO (sección) - No se actualiza nombre y email del estudiante
        if (data.academicTutorId !== undefined) {
            fields.push("academic_tutor_id = ?");
            params.push(data.academicTutorId);
        }
        if (data.academicTutorName !== undefined) {
            fields.push("academic_tutor_name = ?");
            params.push(data.academicTutorName);
        }
        if (data.academicTutorEmail !== undefined) {
            fields.push("academic_tutor_email = ?");
            params.push(data.academicTutorEmail);
        }
        if (data.internshipType !== undefined) {
            fields.push("internship_type = ?");
            params.push(data.internshipType);
        }

        // INFORMACIÓN DE LA EMPRESA (sección)
        if (data.companyShortName !== undefined) {
            fields.push("company_short_name = ?");
            params.push(data.companyShortName);
        }
        if (data.companyLegalName !== undefined) {
            fields.push("company_legal_name = ?");
            params.push(data.companyLegalName);
        }
        if (data.companyTaxId !== undefined) {
            fields.push("company_tax_id = ?");
            params.push(data.companyTaxId);
        }

        // DIRECCIÓN FÍSICA Y EN LA WEB DE LA EMPRESA (sección)
        if (data.companyState !== undefined) {
            fields.push("company_state = ?");
            params.push(data.companyState);
        }
        if (data.companyMunicipality !== undefined) {
            fields.push("company_municipality = ?");
            params.push(data.companyMunicipality);
        }
        if (data.companySettlementType !== undefined) {
            fields.push("company_settlement_type = ?");
            params.push(data.companySettlementType);
        }
        if (data.companySettlementName !== undefined) {
            fields.push("company_settlement_name = ?");
            params.push(data.companySettlementName);
        }
        if (data.companyStreetType !== undefined) {
            fields.push("company_street_type = ?");
            params.push(data.companyStreetType);
        }
        if (data.companyStreetName !== undefined) {
            fields.push("company_street_name = ?");
            params.push(data.companyStreetName);
        }
        if (data.companyExteriorNumber !== undefined) {
            fields.push("company_exterior_number = ?");
            params.push(data.companyExteriorNumber);
        }
        if (data.companyInteriorNumber !== undefined) {
            fields.push("company_interior_number = ?");
            params.push(data.companyInteriorNumber);
        }
        if (data.companyPostalCode !== undefined) {
            fields.push("company_postal_code = ?");
            params.push(data.companyPostalCode);
        }
        if (data.companyWebsite !== undefined) {
            fields.push("company_website = ?");
            params.push(data.companyWebsite);
        }
        if (data.companyLinkedin !== undefined) {
            fields.push("company_linkedin = ?");
            params.push(data.companyLinkedin);
        }

        // INFORMACIÓN DE CONTACTO EN LA EMPRESA (sección)
        if (data.contactName !== undefined) {
            fields.push("contact_name = ?");
            params.push(data.contactName);
        }
        if (data.contactPosition !== undefined) {
            fields.push("contact_position = ?");
            params.push(data.contactPosition);
        }
        if (data.contactEmail !== undefined) {
            fields.push("contact_email = ?");
            params.push(data.contactEmail);
        }
        if (data.contactPhone !== undefined) {
            fields.push("contact_phone = ?");
            params.push(data.contactPhone);
        }
        if (data.contactArea !== undefined) {
            fields.push("contact_area = ?");
            params.push(data.contactArea);
        }

        // SUPERVISOR DEL PROYECTO DE ESTANCIA O ESTADÍA (sección)
        if (data.supervisorName !== undefined) {
            fields.push("supervisor_name = ?");
            params.push(data.supervisorName);
        }
        if (data.supervisorArea !== undefined) {
            fields.push("supervisor_area = ?");
            params.push(data.supervisorArea);
        }
        if (data.supervisorEmail !== undefined) {
            fields.push("supervisor_email = ?");
            params.push(data.supervisorEmail);
        }
        if (data.supervisorPhone !== undefined) {
            fields.push("supervisor_phone = ?");
            params.push(data.supervisorPhone);
        }

        // DATOS DEL PROYECTO (sección)
        if (data.projectName !== undefined) {
            fields.push("project_name = ?");
            params.push(data.projectName);
        }
        if (data.projectStartDate !== undefined) {
            fields.push("project_start_date = ?");
            params.push(data.projectStartDate);
        }
        if (data.projectEndDate !== undefined) {
            fields.push("project_end_date = ?");
            params.push(data.projectEndDate);
        }
        if (data.projectProblemContext !== undefined) {
            fields.push("project_problem_context = ?");
            params.push(data.projectProblemContext);
        }
        if (data.projectProblemDescription !== undefined) {
            fields.push("project_problem_description = ?");
            params.push(data.projectProblemDescription);
        }
        if (data.projectGeneralObjective !== undefined) {
            fields.push("project_general_objective = ?");
            params.push(data.projectGeneralObjective);
        }
        if (data.projectSpecificObjectives !== undefined) {
            fields.push("project_specific_objectives = ?");
            params.push(data.projectSpecificObjectives);
        }
        if (data.projectMainActivities !== undefined) {
            fields.push("project_main_activities = ?");
            params.push(data.projectMainActivities);
        }
        if (data.projectPlannedDeliverables !== undefined) {
            fields.push("project_planned_deliverables = ?");
            params.push(data.projectPlannedDeliverables);
        }
        if (data.projectTechnologies !== undefined) {
            fields.push("project_technologies = ?");
            params.push(data.projectTechnologies);
        }

        // ESTATUS DE LA PROPUESTA
        if (data.proposalStatus !== undefined) {
            fields.push("proposal_status = ?");
            params.push(data.proposalStatus);
        }

        if (data.userUpdate !== undefined) {
            fields.push("user_update = ?");
            params.push(data.userUpdate);
        }

        if (fields.length === 0) {
            throw new Error("No hay campos para actualizar");
        }

        fields.push("updated_at = CURRENT_TIMESTAMP");
        params.push(uuid);

        const sql = `UPDATE project_proposals SET ${fields.join(", ")} WHERE uuid = ? AND active = true`;

        try {
            const result: any = await query(sql, params);
            
            if (result.affectedRows === 0) {
                return null;
            }

            return await this.getPropuesta(uuid);
        } catch (error) {
            console.error("Error updating propuesta:", error);
            throw new Error(`Error al actualizar la propuesta: ${error}`);
        }
    }

    async updateProposalStatus(uuid: string, status: ProposalStatus, userUpdate?: number): Promise<Propuesta | null> {
        const sql = `
            UPDATE project_proposals 
            SET proposal_status = ?, user_update = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE uuid = ? AND active = true
        `;

        try {
            const result: any = await query(sql, [status, userUpdate || null, uuid]);
            
            if (result.affectedRows === 0) {
                return null;
            }

            return await this.getPropuesta(uuid);
        } catch (error) {
            console.error("Error updating proposal status:", error);
            throw new Error(`Error al actualizar el estatus de la propuesta: ${error}`);
        }
    }

    async checkExistingPropuesta(studentId: number, convocatoriaId: number): Promise<boolean> {
        const sql = `
            SELECT COUNT(*) as count 
            FROM project_proposals 
            WHERE student_id = ? AND convocatoria_id = ? AND active = true
        `;

        try {
            const result: any = await query(sql, [studentId, convocatoriaId]);
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
                    // Asegurar que sean arrays
                    pasantiasDisponibles: Array.isArray(row.pasantias_disponibles) 
                        ? row.pasantias_disponibles 
                        : JSON.parse(row.pasantias_disponibles || '[]'),
                    profesoresDisponibles: Array.isArray(row.profesores_disponibles)
                        ? row.profesores_disponibles
                        : JSON.parse(row.profesores_disponibles || '[]')
                };
            }
            return null;
        } catch (error) {
            console.error("Error getting active convocatoria:", error);
            throw new Error(`Error al obtener la convocatoria activa: ${error}`);
        }
    }

    private mapRowToPropuesta(row: any): Propuesta {
        return new Propuesta(
            row.id,
            row.uuid,
            row.convocatoria_id,
            row.student_id,
            row.student_name, // NUEVO
            row.student_email, // NUEVO
            row.academic_tutor_id,
            row.academic_tutor_name,
            row.academic_tutor_email,
            row.internship_type,
            row.company_short_name,
            row.company_legal_name,
            row.company_tax_id,
            row.company_state,
            row.company_municipality,
            row.company_settlement_type,
            row.company_settlement_name,
            row.company_street_type,
            row.company_street_name,
            row.company_exterior_number,
            row.company_interior_number,
            row.company_postal_code,
            row.company_website,
            row.company_linkedin,
            row.contact_name,
            row.contact_position,
            row.contact_email,
            row.contact_phone,
            row.contact_area,
            row.supervisor_name,
            row.supervisor_area,
            row.supervisor_email,
            row.supervisor_phone,
            row.project_name,
            new Date(row.project_start_date),
            new Date(row.project_end_date),
            row.project_problem_context,
            row.project_problem_description,
            row.project_general_objective,
            row.project_specific_objectives,
            row.project_main_activities,
            row.project_planned_deliverables,
            row.project_technologies,
            row.proposal_status as ProposalStatus,
            row.active,
            row.created_at,
            row.updated_at,
            row.user_creation,
            row.user_update
        );
    }
} las propuestas: ${error}`);
        }
    }

    async getPropuestasByConvocatoria(convocatoriaId: number): Promise<Propuesta[] | null> {
        const sql = `
            SELECT * FROM project_proposals 
            WHERE convocatoria_id = ? AND active = true 
            ORDER BY created_at DESC
        `;

        try {
            const result: any = await query(sql, [convocatoriaId]);
            
            if (result.length > 0) {
                return result.map((row: any) => this.mapRowToPropuesta(row));
            }
            return [];
        } catch (error) {
            console.error("Error getting propuestas by convocatoria:", error);
            throw new Error(`Error al obtener las propuestas por convocatoria: ${error}`);
        }
    }

    async getPropuestasByStudent(studentId: number): Promise<Propuesta[] | null> {
        const sql = `
            SELECT * FROM project_proposals 
            WHERE student_id = ? AND active = true 
            ORDER BY created_at DESC
        `;

        try {
            const result: any = await query(sql, [studentId]);
            
            if (result.length > 0) {
                return result.map((row: any) => this.mapRowToPropuesta(row));
            }
            return [];
        } catch (error) {
            console.error("Error getting propuestas by student:", error);
            throw new Error(`Error al obtener las propuestas del estudiante: ${error}`);
        }
    }

    async getPropuestasByStatus(status: ProposalStatus): Promise<Propuesta[] | null> {
        const sql = `
            SELECT * FROM project_proposals 
            WHERE proposal_status = ? AND active = true 
            ORDER BY created_at DESC
        `;

        try {
            const result: any = await query(sql, [status]);
            
            if (result.length > 0) {
                return result.map((row: any) => this.mapRowToPropuesta(row));
            }
            return [];
        } catch (error) {
            console.error("Error getting propuestas by status:", error);
            throw new Error(`Error al obtener