// src/propuestas-comentarios/domain/models/proposalComment.ts
export class ProposalComment {
    constructor(
        private readonly id: number,
        private readonly uuid: string,
        private readonly proposalId: string,  // ⭐ Cambiar de number a string
        private readonly tutorId: number,
        private readonly sectionName: string,
        private readonly subsectionName: string,
        private readonly commentText: string,
        private readonly voteStatus: 'ACEPTADO' | 'RECHAZADO' | 'ACTUALIZA',
        private readonly active?: boolean,
        private readonly createdAt?: Date,
        private readonly updatedAt?: Date,
        
        // Información adicional del tutor (opcional, viene de la vista)
        private readonly tutorUuid?: string,
        private readonly tutorName?: string,
        private readonly tutorLastName?: string,
        private readonly tutorEmail?: string,
        
        // Información adicional de la propuesta (opcional, viene de la vista)
        private readonly proposalUuid?: string,
        private readonly projectName?: string,
        private readonly companyShortName?: string
    ) {}

    // Getters básicos
    getId(): number { return this.id; }
    getUuid(): string { return this.uuid; }
    getProposalId(): string { return this.proposalId; }  // ⭐ Ahora retorna string
    getTutorId(): number { return this.tutorId; }
    getSectionName(): string { return this.sectionName; }
    getSubsectionName(): string { return this.subsectionName; }
    getCommentText(): string { return this.commentText; }
    getVoteStatus(): 'ACEPTADO' | 'RECHAZADO' | 'ACTUALIZA' { return this.voteStatus; }
    isActive(): boolean | undefined { return this.active; }
    getCreatedAt(): Date | undefined { return this.createdAt; }
    getUpdatedAt(): Date | undefined { return this.updatedAt; }
    
    // Getters de información adicional
    getTutorUuid(): string | undefined { return this.tutorUuid; }
    getTutorName(): string | undefined { return this.tutorName; }
    getTutorLastName(): string | undefined { return this.tutorLastName; }
    getTutorEmail(): string | undefined { return this.tutorEmail; }
    getTutorFullName(): string { 
        return `${this.tutorName || ''} ${this.tutorLastName || ''}`.trim(); 
    }
    
    getProposalUuid(): string | undefined { return this.proposalUuid; }
    getProjectName(): string | undefined { return this.projectName; }
    getCompanyShortName(): string | undefined { return this.companyShortName; }
    
    // Métodos de utilidad
    isApproved(): boolean { return this.voteStatus === 'ACEPTADO'; }
    isRejected(): boolean { return this.voteStatus === 'RECHAZADO'; }
    needsUpdate(): boolean { return this.voteStatus === 'ACTUALIZA'; }
    
    getFullSubsectionPath(): string {
        return `${this.sectionName} > ${this.subsectionName}`;
    }
}