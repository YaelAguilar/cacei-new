// src/features/propuestas-comentarios/data/repository/CommentRepository.ts
import ApiClient from "../../../../core/API/ApiClient";
import { 
    JsonApiCommentResponse, 
    JsonApiCommentsListResponse,
    CreateCommentRequest,
    UpdateCommentRequest 
} from "../models/ProposalCommentDTO";
import { ProposalComment } from "../models/ProposalComment";

export class CommentRepository {
    
    async createComment(data: CreateCommentRequest): Promise<ProposalComment> {
        try {
            const response = await ApiClient.post<JsonApiCommentResponse>('/comentarios', data);
            
            if (response.status === 201 && response.data.data) {
                return this.mapDTOToModel(response.data.data);
            }
            
            throw new Error('Error al crear el comentario');
        } catch (error) {
            console.error("Error en createComment:", error);
            throw error;
        }
    }

    async updateComment(commentId: string, data: UpdateCommentRequest): Promise<ProposalComment> {
        try {
            const response = await ApiClient.put<JsonApiCommentResponse>(`/comentarios/${commentId}`, data);
            
            if (response.status === 200 && response.data.data) {
                return this.mapDTOToModel(response.data.data);
            }
            
            throw new Error('Error al actualizar el comentario');
        } catch (error) {
            console.error("Error en updateComment:", error);
            throw error;
        }
    }

    // ❌ Eliminar comentario DESHABILITADO
    async deleteComment(commentId: string): Promise<boolean> {
        throw new Error("Los comentarios no se pueden eliminar una vez creados");
    }

    // ✅ NUEVO: Aprobar toda la propuesta
    async approveProposal(proposalId: string): Promise<boolean> {
        try {
            const response = await ApiClient.post('/aprobar-propuesta', {
                proposalId
            });
            
            return response.status === 200;
        } catch (error) {
            console.error("Error en approveProposal:", error);
            throw error;
        }
    }

    // ✅ NUEVO: Rechazar toda la propuesta
    async rejectProposal(proposalId: string): Promise<boolean> {
        try {
            const response = await ApiClient.post('/rechazar-propuesta', {
                proposalId
            });
            
            return response.status === 200;
        } catch (error) {
            console.error("Error en rejectProposal:", error);
            throw error;
        }
    }

    // ✅ NUEVO: Actualizar toda la propuesta
    async updateProposal(proposalId: string): Promise<boolean> {
        try {
            const response = await ApiClient.post('/actualizar-propuesta', {
                proposalId
            });
            
            return response.status === 200;
        } catch (error) {
            console.error("Error en updateProposal:", error);
            throw error;
        }
    }

    async getCommentsByProposal(proposalId: string): Promise<ProposalComment[]> {
        console.log('🔍 CommentRepository.getCommentsByProposal() called');
        console.log('📦 proposalId recibido:', proposalId);
        
        try {
            const url = `/propuestas/${proposalId}/comentarios`;
            console.log('📤 URL completa:', url);
            console.log('📤 Haciendo GET request...');
            
            const response = await ApiClient.get<JsonApiCommentsListResponse>(url);
            
            console.log('📥 Response status:', response.status);
            console.log('📥 Response data:', response.data);
            
            if (response.status === 200 && response.data.data) {
                const mappedComments = response.data.data.map(dto => this.mapDTOToModel(dto));
                console.log('✅ Comentarios mapeados:', mappedComments.length);
                return mappedComments;
            }
            
            console.log('⚠️ No se encontraron comentarios');
            return [];
        } catch (error) {
            console.error("❌ Error en getCommentsByProposal:", error);
            throw error;
        }
    }

    async getMyComments(): Promise<ProposalComment[]> {
        try {
            const response = await ApiClient.get<JsonApiCommentsListResponse>('/mis-comentarios');
            
            if (response.status === 200 && response.data.data) {
                return response.data.data.map(dto => this.mapDTOToModel(dto));
            }
            
            return [];
        } catch (error) {
            console.error("Error en getMyComments:", error);
            throw error;
        }
    }

    private mapDTOToModel(dto: any): ProposalComment {
        const attrs = dto.attributes;
        return new ProposalComment(
            dto.id,
            attrs.proposalId,
            attrs.tutorId,
            attrs.tutorName || '',
            attrs.tutorEmail || '',
            attrs.sectionName,
            attrs.subsectionName,
            attrs.commentText,
            attrs.voteStatus,
            attrs.active,
            new Date(attrs.createdAt),
            new Date(attrs.updatedAt),
            attrs.proposalUuid,
            attrs.projectName,
            attrs.companyShortName
        );
    }
}