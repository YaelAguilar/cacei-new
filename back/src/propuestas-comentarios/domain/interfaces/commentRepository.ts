// src/propuestas-comentarios/domain/interfaces/commentRepository.ts
import { ProposalComment } from "../models/proposalComment";

export interface CommentCreateData {
    proposalId: string;
    tutorId: number;
    sectionName: string;
    subsectionName: string;
    commentText: string;
    voteStatus: 'ACEPTADO' | 'RECHAZADO' | 'ACTUALIZA';
}

export interface CommentUpdateData {
    commentText?: string;
    voteStatus?: 'ACEPTADO' | 'RECHAZADO' | 'ACTUALIZA';
}

export interface CommentRepository {
    createComment(data: CommentCreateData): Promise<ProposalComment | null>;
    
    updateComment(uuid: string, data: CommentUpdateData): Promise<ProposalComment | null>;
    
    getCommentsByProposal(proposalId: string): Promise<ProposalComment[] | null>;
    
    getCommentsByTutor(tutorId: number): Promise<ProposalComment[] | null>;
    
    getComment(uuid: string): Promise<ProposalComment | null>;
    
    deleteComment(uuid: string): Promise<boolean>;
    
    checkExistingComment(
        proposalId: number, 
        tutorId: number, 
        subsectionName: string
    ): Promise<ProposalComment | null>;

    // ✅ NUEVO: Verificar comentario existente en toda la SECCIÓN (no solo subsección)
    checkExistingCommentInSection(
        proposalId: number, 
        tutorId: number, 
        sectionName: string
    ): Promise<ProposalComment | null>;

    // ✅ NUEVO: Aprobar toda la propuesta
    approveEntireProposal(
        proposalId: string,
        tutorId: number,
        tutorName: string,
        tutorEmail: string
    ): Promise<boolean>;

    // ✅ NUEVO: Rechazar toda la propuesta
    rejectEntireProposal(
        proposalId: string,
        tutorId: number,
        tutorName: string,
        tutorEmail: string
    ): Promise<boolean>;

    // ✅ NUEVO: Actualizar toda la propuesta
    updateEntireProposal(
        proposalId: string,
        tutorId: number,
        tutorName: string,
        tutorEmail: string
    ): Promise<boolean>;
}