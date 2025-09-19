// src/features/propuestas-comentarios/data/models/ProposalCommentDTO.ts
export interface ProposalCommentAttributes {
    proposalId: string;
    tutorId: number;
    tutorName?: string;
    tutorEmail?: string;
    sectionName: string;
    subsectionName: string;
    commentText: string;
    voteStatus: 'ACEPTADO' | 'RECHAZADO' | 'ACTUALIZA';
    active: boolean;
    createdAt: string;
    updatedAt: string;
    proposalUuid?: string;
    projectName?: string;
    companyShortName?: string;
}

export interface ProposalCommentDTO {
    type: string;
    id: string;
    attributes: ProposalCommentAttributes;
}

export interface JsonApiCommentResponse {
    data: ProposalCommentDTO;
}

export interface JsonApiCommentsListResponse {
    data: ProposalCommentDTO[];
}

export interface CreateCommentRequest {
    proposalId: string;
    sectionName: string;
    subsectionName: string;
    commentText: string;
    voteStatus: 'ACEPTADO' | 'RECHAZADO' | 'ACTUALIZA';
}

export interface UpdateCommentRequest {
    commentText?: string;
    voteStatus?: 'ACEPTADO' | 'RECHAZADO' | 'ACTUALIZA';
}