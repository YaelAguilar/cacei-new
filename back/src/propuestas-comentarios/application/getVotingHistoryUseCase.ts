// src/propuestas-comentarios/application/getVotingHistoryUseCase.ts
import { CommentRepository } from "../domain/interfaces/commentRepository";
import { PropuestaRepository } from "../../propuestas/domain/interfaces/propuestaRepository";

export interface VotingHistoryFilters {
    tutorId?: number;
    convocatoriaId?: number;
    status?: string;
    dateFrom?: Date;
    dateTo?: Date;
}

export interface VotingHistoryItem {
    commentId: string;
    proposalId: string;
    proposalUuid: string;
    projectName: string;
    companyName: string;
    studentName: string;
    studentEmail: string;
    convocatoriaName: string;
    convocatoriaFecha: Date;
    sectionName: string;
    subsectionName: string;
    commentText: string;
    voteStatus: 'ACEPTADO' | 'RECHAZADO' | 'ACTUALIZA';
    createdAt: Date;
    updatedAt: Date;
}

export class GetVotingHistoryUseCase {
    constructor(
        private readonly commentRepository: CommentRepository,
        private readonly propuestaRepository: PropuestaRepository
    ) {}

    async run(requesterId: number, requesterRole: string, filters?: VotingHistoryFilters): Promise<VotingHistoryItem[]> {
        try {
            console.log('📊 GetVotingHistoryUseCase iniciado:', { 
                requesterId, 
                requesterRole, 
                filters 
            });

            // Validar permisos
            this.validatePermissions(requesterRole, filters);

            // Obtener historial según el rol
            if (requesterRole === 'Director' || requesterRole === 'SUPER-ADMIN') {
                return await this.getDirectorVotingHistory(filters);
            } else {
                return await this.getTutorVotingHistory(requesterId, filters);
            }
        } catch (error) {
            console.error("Error in GetVotingHistoryUseCase:", error);
            throw error;
        }
    }

    private validatePermissions(requesterRole: string, filters?: VotingHistoryFilters): void {
        const allowedRoles = ['Director', 'SUPER-ADMIN', 'PTC', 'PA'];
        
        if (!allowedRoles.includes(requesterRole)) {
            throw new Error("No tienes permisos para acceder al historial de votaciones");
        }

        // Solo los directores pueden filtrar por otros tutores
        if (filters?.tutorId && requesterRole !== 'Director' && requesterRole !== 'SUPER-ADMIN') {
            throw new Error("No puedes ver el historial de otros tutores");
        }
    }

    private async getDirectorVotingHistory(filters?: VotingHistoryFilters): Promise<VotingHistoryItem[]> {
        // Los directores pueden ver todas las votaciones de todos los períodos
        let sql = `
            SELECT 
                pc.id as comment_id,
                pc.uuid as comment_uuid,
                pc.proposal_id,
                pp.uuid as proposal_uuid,
                pp.project_name,
                pp.company_short_name,
                pp.student_name,
                pp.student_email,
                c.nombre as convocatoria_nombre,
                c.fecha_limite as convocatoria_fecha,
                pc.section_name,
                pc.subsection_name,
                pc.comment_text,
                pc.vote_status,
                pc.created_at,
                pc.updated_at
            FROM proposal_comments pc
            LEFT JOIN project_proposals pp ON pc.proposal_id = pp.id
            LEFT JOIN convocatorias c ON pp.convocatoria_id = c.id
            WHERE pc.active = true
        `;

        const params: any[] = [];
        const conditions: string[] = [];

        // Aplicar filtros
        if (filters) {
            if (filters.tutorId) {
                conditions.push('pc.tutor_id = ?');
                params.push(filters.tutorId);
            }

            if (filters.convocatoriaId) {
                conditions.push('pp.convocatoria_id = ?');
                params.push(filters.convocatoriaId);
            }

            if (filters.status && filters.status !== 'all') {
                conditions.push('pc.vote_status = ?');
                params.push(filters.status);
            }

            if (filters.dateFrom) {
                conditions.push('pc.created_at >= ?');
                params.push(filters.dateFrom);
            }

            if (filters.dateTo) {
                conditions.push('pc.created_at <= ?');
                params.push(filters.dateTo);
            }
        }

        if (conditions.length > 0) {
            sql += ` AND ${conditions.join(' AND ')}`;
        }

        sql += ` ORDER BY pc.created_at DESC`;

        try {
            const { query } = require('../../../database/mysql');
            const result: any[] = await query(sql, params);
            
            return result.map(row => ({
                commentId: row.comment_uuid,
                proposalId: row.proposal_id,
                proposalUuid: row.proposal_uuid,
                projectName: row.project_name,
                companyName: row.company_short_name || 'Sin nombre',
                studentName: row.student_name,
                studentEmail: row.student_email,
                convocatoriaName: row.convocatoria_nombre,
                convocatoriaFecha: new Date(row.convocatoria_fecha),
                sectionName: row.section_name,
                subsectionName: row.subsection_name,
                commentText: row.comment_text,
                voteStatus: row.vote_status,
                createdAt: new Date(row.created_at),
                updatedAt: new Date(row.updated_at)
            }));
        } catch (error) {
            console.error("Error getting director voting history:", error);
            throw new Error(`Error al obtener historial de votaciones del director: ${error}`);
        }
    }

    private async getTutorVotingHistory(tutorId: number, filters?: VotingHistoryFilters): Promise<VotingHistoryItem[]> {
        // Los tutores solo pueden ver sus propias votaciones
        let sql = `
            SELECT 
                pc.id as comment_id,
                pc.uuid as comment_uuid,
                pc.proposal_id,
                pp.uuid as proposal_uuid,
                pp.project_name,
                pp.company_short_name,
                pp.student_name,
                pp.student_email,
                c.nombre as convocatoria_nombre,
                c.fecha_limite as convocatoria_fecha,
                pc.section_name,
                pc.subsection_name,
                pc.comment_text,
                pc.vote_status,
                pc.created_at,
                pc.updated_at
            FROM proposal_comments pc
            LEFT JOIN project_proposals pp ON pc.proposal_id = pp.id
            LEFT JOIN convocatorias c ON pp.convocatoria_id = c.id
            WHERE pc.active = true AND pc.tutor_id = ?
        `;

        const params: any[] = [tutorId];
        const conditions: string[] = [];

        // Aplicar filtros adicionales
        if (filters) {
            if (filters.convocatoriaId) {
                conditions.push('pp.convocatoria_id = ?');
                params.push(filters.convocatoriaId);
            }

            if (filters.status && filters.status !== 'all') {
                conditions.push('pc.vote_status = ?');
                params.push(filters.status);
            }

            if (filters.dateFrom) {
                conditions.push('pc.created_at >= ?');
                params.push(filters.dateFrom);
            }

            if (filters.dateTo) {
                conditions.push('pc.created_at <= ?');
                params.push(filters.dateTo);
            }
        }

        if (conditions.length > 0) {
            sql += ` AND ${conditions.join(' AND ')}`;
        }

        sql += ` ORDER BY pc.created_at DESC`;

        try {
            const { query } = require('../../../database/mysql');
            const result: any[] = await query(sql, params);
            
            return result.map(row => ({
                commentId: row.comment_uuid,
                proposalId: row.proposal_id,
                proposalUuid: row.proposal_uuid,
                projectName: row.project_name,
                companyName: row.company_short_name || 'Sin nombre',
                studentName: row.student_name,
                studentEmail: row.student_email,
                convocatoriaName: row.convocatoria_nombre,
                convocatoriaFecha: new Date(row.convocatoria_fecha),
                sectionName: row.section_name,
                subsectionName: row.subsection_name,
                commentText: row.comment_text,
                voteStatus: row.vote_status,
                createdAt: new Date(row.created_at),
                updatedAt: new Date(row.updated_at)
            }));
        } catch (error) {
            console.error("Error getting tutor voting history:", error);
            throw new Error(`Error al obtener historial de votaciones del tutor: ${error}`);
        }
    }
}


