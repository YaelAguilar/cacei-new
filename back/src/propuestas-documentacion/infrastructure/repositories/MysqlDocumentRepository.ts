// src/propuestas-documentacion/infrastructure/repositories/MysqlDocumentRepository.ts
import { DocumentRepository, DocumentCreateData, DocumentUpdateData } from "../../domain/interfaces/documentRepository";
import { ProposalDocument } from "../../domain/models/proposalDocument";
import { query } from "../../../database/mysql";
import { v4 as uuidv4 } from 'uuid';

export class MysqlDocumentRepository implements DocumentRepository {

    async createDocument(data: DocumentCreateData): Promise<ProposalDocument | null> {
        const sql = `
            INSERT INTO proposal_documents (
                uuid, proposal_id, student_id, file_name, original_file_name, 
                file_size, mime_type, file_path, uploaded_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `;

        const uuid = uuidv4();
        const params: any[] = [
            uuid,
            data.proposalId,
            data.studentId,
            data.fileName,
            data.originalFileName,
            data.fileSize,
            data.mimeType,
            data.filePath
        ];

        try {
            const result: any = await query(sql, params);
            
            return new ProposalDocument(
                result.insertId,
                uuid,
                data.proposalId,
                data.studentId,
                data.fileName,
                data.originalFileName,
                data.fileSize,
                data.mimeType,
                data.filePath,
                new Date(),
                true,
                new Date(),
                new Date()
            );
        } catch (error) {
            console.error("Error creating document:", error);
            throw new Error(`Error al crear el documento: ${error}`);
        }
    }

    async getDocument(uuid: string): Promise<ProposalDocument | null> {
        const sql = `
            SELECT * FROM proposal_documents 
            WHERE uuid = ? AND active = true
        `;

        try {
            const result: any[] = await query(sql, [uuid]);
            
            if (result.length === 0) {
                return null;
            }

            const row = result[0];
            return new ProposalDocument(
                row.id,
                row.uuid,
                row.proposal_id,
                row.student_id,
                row.file_name,
                row.original_file_name,
                row.file_size,
                row.mime_type,
                row.file_path,
                new Date(row.uploaded_at),
                row.active,
                new Date(row.created_at),
                new Date(row.updated_at)
            );
        } catch (error) {
            console.error("Error getting document:", error);
            throw new Error(`Error al obtener el documento: ${error}`);
        }
    }

    async getDocumentsByProposal(proposalId: string): Promise<ProposalDocument[]> {
        const sql = `
            SELECT * FROM proposal_documents 
            WHERE proposal_id = ? AND active = true
            ORDER BY uploaded_at DESC
        `;

        try {
            const result: any[] = await query(sql, [proposalId]);
            
            return result.map(row => new ProposalDocument(
                row.id,
                row.uuid,
                row.proposal_id,
                row.student_id,
                row.file_name,
                row.original_file_name,
                row.file_size,
                row.mime_type,
                row.file_path,
                new Date(row.uploaded_at),
                row.active,
                new Date(row.created_at),
                new Date(row.updated_at)
            ));
        } catch (error) {
            console.error("Error getting documents by proposal:", error);
            throw new Error(`Error al obtener documentos de la propuesta: ${error}`);
        }
    }

    async getDocumentsByStudent(studentId: number): Promise<ProposalDocument[]> {
        const sql = `
            SELECT * FROM proposal_documents 
            WHERE student_id = ? AND active = true
            ORDER BY uploaded_at DESC
        `;

        try {
            const result: any[] = await query(sql, [studentId]);
            
            return result.map(row => new ProposalDocument(
                row.id,
                row.uuid,
                row.proposal_id,
                row.student_id,
                row.file_name,
                row.original_file_name,
                row.file_size,
                row.mime_type,
                row.file_path,
                new Date(row.uploaded_at),
                row.active,
                new Date(row.created_at),
                new Date(row.updated_at)
            ));
        } catch (error) {
            console.error("Error getting documents by student:", error);
            throw new Error(`Error al obtener documentos del estudiante: ${error}`);
        }
    }

    async updateDocument(uuid: string, data: DocumentUpdateData): Promise<ProposalDocument | null> {
        const updateFields: string[] = [];
        const params: any[] = [];

        if (data.fileName !== undefined) {
            updateFields.push('file_name = ?');
            params.push(data.fileName);
        }

        if (data.originalFileName !== undefined) {
            updateFields.push('original_file_name = ?');
            params.push(data.originalFileName);
        }

        if (data.fileSize !== undefined) {
            updateFields.push('file_size = ?');
            params.push(data.fileSize);
        }

        if (data.mimeType !== undefined) {
            updateFields.push('mime_type = ?');
            params.push(data.mimeType);
        }

        if (data.filePath !== undefined) {
            updateFields.push('file_path = ?');
            params.push(data.filePath);
        }

        if (data.active !== undefined) {
            updateFields.push('active = ?');
            params.push(data.active);
        }

        if (updateFields.length === 0) {
            return await this.getDocument(uuid);
        }

        updateFields.push('updated_at = NOW()');
        params.push(uuid);

        const sql = `
            UPDATE proposal_documents 
            SET ${updateFields.join(', ')}
            WHERE uuid = ? AND active = true
        `;

        try {
            await query(sql, params);
            return await this.getDocument(uuid);
        } catch (error) {
            console.error("Error updating document:", error);
            throw new Error(`Error al actualizar el documento: ${error}`);
        }
    }

    async deleteDocument(uuid: string): Promise<boolean> {
        const sql = `
            UPDATE proposal_documents 
            SET active = false, updated_at = NOW()
            WHERE uuid = ?
        `;

        try {
            const result: any = await query(sql, [uuid]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error("Error deleting document:", error);
            throw new Error(`Error al eliminar el documento: ${error}`);
        }
    }

    async hasDocuments(proposalId: string): Promise<boolean> {
        const sql = `
            SELECT COUNT(*) as count FROM proposal_documents 
            WHERE proposal_id = ? AND active = true
        `;

        try {
            const result: any[] = await query(sql, [proposalId]);
            return result[0].count > 0;
        } catch (error) {
            console.error("Error checking if proposal has documents:", error);
            throw new Error(`Error al verificar documentos de la propuesta: ${error}`);
        }
    }

    async countDocumentsByProposal(proposalId: string): Promise<number> {
        const sql = `
            SELECT COUNT(*) as count FROM proposal_documents 
            WHERE proposal_id = ? AND active = true
        `;

        try {
            const result: any[] = await query(sql, [proposalId]);
            return result[0].count;
        } catch (error) {
            console.error("Error counting documents by proposal:", error);
            throw new Error(`Error al contar documentos de la propuesta: ${error}`);
        }
    }
}

