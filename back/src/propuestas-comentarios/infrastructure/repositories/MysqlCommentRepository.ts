// src/propuestas-comentarios/infrastructure/repositories/MysqlCommentRepository.ts
import { CommentRepository, CommentCreateData, CommentUpdateData } from "../../domain/interfaces/commentRepository";
import { ProposalComment } from "../../domain/models/proposalComment";
import { query } from "../../../database/mysql";
import { v4 as uuidv4 } from 'uuid';

export class MysqlCommentRepository implements CommentRepository {

    async createComment(data: CommentCreateData): Promise<ProposalComment | null> {
        const sql = `
            INSERT INTO proposal_comments (
                uuid, proposal_id, tutor_id, section_name, subsection_name, 
                comment_text, vote_status
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const uuid = uuidv4();
        const params: any[] = [
            uuid,
            data.proposalId,
            data.tutorId,
            data.sectionName,
            data.subsectionName,
            data.commentText,
            data.voteStatus
        ];

        try {
            const result: any = await query(sql, params);
            
            return new ProposalComment(
                result.insertId,
                uuid,
                data.proposalId,
                data.tutorId,
                data.sectionName,
                data.subsectionName,
                data.commentText,
                data.voteStatus,
                true,
                new Date(),
                new Date()
            );
        } catch (error) {
            console.error("Error creating comment:", error);
            throw new Error(`Error al crear el comentario: ${error}`);
        }
    }

    async updateComment(uuid: string, data: CommentUpdateData): Promise<ProposalComment | null> {
        // ✅ NUEVO: Verificar que el comentario sea ACTUALIZA antes de permitir edición
        const existingComment = await this.getComment(uuid);
        if (!existingComment) {
            throw new Error("Comentario no encontrado");
        }

        if (existingComment.getVoteStatus() !== 'ACTUALIZA') {
            throw new Error("Solo se pueden editar comentarios con estado 'ACTUALIZA'");
        }

        const fields: string[] = [];
        const params: any[] = [];

        if (data.commentText !== undefined) {
            fields.push("comment_text = ?");
            params.push(data.commentText);
        }

        if (data.voteStatus !== undefined) {
            fields.push("vote_status = ?");
            params.push(data.voteStatus);
        }

        if (fields.length === 0) {
            throw new Error("No hay campos para actualizar");
        }

        fields.push("updated_at = CURRENT_TIMESTAMP");
        params.push(uuid);

        const sql = `UPDATE proposal_comments SET ${fields.join(", ")} WHERE uuid = ? AND active = true`;

        try {
            const result: any = await query(sql, params);
            
            if (result.affectedRows === 0) {
                return null;
            }

            return await this.getComment(uuid);
        } catch (error) {
            console.error("Error updating comment:", error);
            throw new Error(`Error al actualizar el comentario: ${error}`);
        }
    }

    async getCommentsByProposal(proposalId: string): Promise<ProposalComment[] | null> {
        console.log('🔍 getCommentsByProposal called with:', proposalId);
        
        let numericProposalId: number;
        
        // Verificar si es UUID o ID numérico
        if (isNaN(Number(proposalId))) {
            console.log('📝 proposalId es UUID, convirtiendo a ID numérico...');
            // Es un UUID, convertir a ID numérico
            const proposalQuery = `SELECT id FROM project_proposals WHERE uuid = ? AND active = true`;
            try {
                const proposalResult: any = await query(proposalQuery, [proposalId]);
                if (proposalResult.length === 0) {
                    console.log('❌ No se encontró propuesta con UUID:', proposalId);
                    return [];
                }
                numericProposalId = proposalResult[0].id;
                console.log('✅ ID numérico encontrado:', numericProposalId);
            } catch (error) {
                console.error("Error getting proposal ID:", error);
                return [];
            }
        } else {
            // Ya es un ID numérico
            numericProposalId = Number(proposalId);
            console.log('📝 proposalId ya es numérico:', numericProposalId);
        }

        const sql = `
            SELECT * FROM proposal_comments_with_details 
            WHERE proposal_id = ? AND active = true 
            ORDER BY created_at DESC
        `;

        try {
            const result: any = await query(sql, [numericProposalId]);
            console.log(`✅ Comentarios encontrados: ${result.length}`);
            
            if (result.length > 0) {
                return result.map((row: any) => this.mapRowToComment(row));
            }
            return [];
        } catch (error) {
            console.error("Error getting comments by proposal:", error);
            throw new Error(`Error al obtener los comentarios: ${error}`);
        }
    }

    async getCommentsByTutor(tutorId: number): Promise<ProposalComment[] | null> {
        const sql = `
            SELECT * FROM proposal_comments_with_details 
            WHERE tutor_id = ? AND active = true 
            ORDER BY created_at DESC
        `;

        try {
            const result: any = await query(sql, [tutorId]);
            
            if (result.length > 0) {
                return result.map((row: any) => this.mapRowToComment(row));
            }
            return [];
        } catch (error) {
            console.error("Error getting comments by tutor:", error);
            throw new Error(`Error al obtener los comentarios: ${error}`);
        }
    }

    async getComment(uuid: string): Promise<ProposalComment | null> {
        const sql = `SELECT * FROM proposal_comments_with_details WHERE uuid = ? AND active = true`;
        
        try {
            const result: any = await query(sql, [uuid]);
            
            if (result.length > 0) {
                return this.mapRowToComment(result[0]);
            }
            return null;
        } catch (error) {
            console.error("Error getting comment:", error);
            throw new Error(`Error al obtener el comentario: ${error}`);
        }
    }

    async deleteComment(uuid: string): Promise<boolean> {
        // ✅ COMENTARIOS NO SE PUEDEN ELIMINAR - Lanzar error
        throw new Error("Los comentarios no se pueden eliminar una vez creados");
    }

    async checkExistingComment(
        proposalId: number, 
        tutorId: number, 
        subsectionName: string
    ): Promise<ProposalComment | null> {
        const sql = `
            SELECT * FROM proposal_comments_with_details 
            WHERE proposal_id = ? AND tutor_id = ? AND subsection_name = ? AND active = true
        `;
        
        try {
            const result: any = await query(sql, [proposalId, tutorId, subsectionName]);
            
            if (result.length > 0) {
                return this.mapRowToComment(result[0]);
            }
            return null;
        } catch (error) {
            console.error("Error checking existing comment:", error);
            throw new Error(`Error al verificar comentario existente: ${error}`);
        }
    }

    // ✅ NUEVO: Verificar comentario existente en toda la SECCIÓN
    async checkExistingCommentInSection(
        proposalId: number, 
        tutorId: number, 
        sectionName: string
    ): Promise<ProposalComment | null> {
        const sql = `
            SELECT * FROM proposal_comments_with_details 
            WHERE proposal_id = ? AND tutor_id = ? AND section_name = ? AND active = true
        `;
        
        try {
            const result: any = await query(sql, [proposalId, tutorId, sectionName]);
            
            if (result.length > 0) {
                return this.mapRowToComment(result[0]);
            }
            return null;
        } catch (error) {
            console.error("Error checking existing comment in section:", error);
            throw new Error(`Error al verificar comentario existente en sección: ${error}`);
        }
    }

    // ✅ NUEVO: Aprobar toda la propuesta
    async approveEntireProposal(
        proposalId: string,
        tutorId: number,
        tutorName: string,
        tutorEmail: string
    ): Promise<boolean> {
        try {
            // Convertir proposalId si es UUID
            let numericProposalId: number;
            
            if (isNaN(Number(proposalId))) {
                const proposalQuery = `SELECT id FROM project_proposals WHERE uuid = ? AND active = true`;
                const proposalResult: any = await query(proposalQuery, [proposalId]);
                if (proposalResult.length === 0) {
                    throw new Error("Propuesta no encontrada");
                }
                numericProposalId = proposalResult[0].id;
            } else {
                numericProposalId = Number(proposalId);
            }

            // Verificar si el tutor ya tiene comentarios en esta propuesta
            const existingComments = await query(
                `SELECT COUNT(*) as count FROM proposal_comments WHERE proposal_id = ? AND tutor_id = ? AND active = true`,
                [numericProposalId, tutorId]
            );

            if (existingComments[0].count > 0) {
                throw new Error("No se puede aprobar toda la propuesta si ya existen comentarios específicos. Elimine los comentarios existentes primero.");
            }

            // Crear un comentario especial de aprobación general
            const uuid = uuidv4();
            const sql = `
                INSERT INTO proposal_comments (
                    uuid, proposal_id, tutor_id, section_name, subsection_name, 
                    comment_text, vote_status
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

            const params = [
                uuid,
                numericProposalId,
                tutorId,
                'APROBACIÓN_GENERAL',
                'PROPUESTA_COMPLETA',
                `Propuesta aprobada en su totalidad por ${tutorName} (${tutorEmail})`,
                'ACEPTADO'
            ];

            const result: any = await query(sql, params);
            return result.affectedRows > 0;

        } catch (error) {
            console.error("Error approving entire proposal:", error);
            throw new Error(`Error al aprobar la propuesta completa: ${error}`);
        }
    }

    private mapRowToComment(row: any): ProposalComment {
        return new ProposalComment(
            row.id,
            row.uuid,
            row.proposal_id,
            row.tutor_id,
            row.section_name,
            row.subsection_name,
            row.comment_text,
            row.vote_status,
            row.active,
            row.created_at,
            row.updated_at,
            row.tutor_uuid,
            row.tutor_name,
            row.tutor_last_name,
            row.tutor_email,
            row.proposal_uuid,
            row.project_name,
            row.company_short_name
        );
    }
}