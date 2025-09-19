// src/features/propuestas-comentarios/data/models/ProposalComment.ts
export class ProposalComment {
    constructor(
        private readonly id: string,
        private readonly proposalId: number,
        private readonly tutorId: number,
        private readonly tutorName: string,
        private readonly tutorEmail: string,
        private readonly sectionName: string,
        private readonly subsectionName: string,
        private readonly commentText: string,
        private readonly voteStatus: 'ACEPTADO' | 'RECHAZADO' | 'ACTUALIZA',
        private readonly active: boolean,
        private readonly createdAt: Date,
        private readonly updatedAt: Date,
        private readonly proposalUuid?: string,
        private readonly projectName?: string,
        private readonly companyShortName?: string
    ) {}

    // Getters básicos
    getId(): string { return this.id; }
    getProposalId(): number { return this.proposalId; }
    getTutorId(): number { return this.tutorId; }
    getTutorName(): string { return this.tutorName; }
    getTutorEmail(): string { return this.tutorEmail; }
    getSectionName(): string { return this.sectionName; }
    getSubsectionName(): string { return this.subsectionName; }
    getCommentText(): string { return this.commentText; }
    getVoteStatus(): 'ACEPTADO' | 'RECHAZADO' | 'ACTUALIZA' { return this.voteStatus; }
    isActive(): boolean { return this.active; }
    getCreatedAt(): Date { return this.createdAt; }
    getUpdatedAt(): Date { return this.updatedAt; }
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

    getVoteStatusColor(): string {
        switch (this.voteStatus) {
            case 'ACEPTADO': return 'text-green-600 bg-green-100 border-green-300';
            case 'RECHAZADO': return 'text-red-600 bg-red-100 border-red-300';
            case 'ACTUALIZA': return 'text-yellow-600 bg-yellow-100 border-yellow-300';
            default: return 'text-gray-600 bg-gray-100 border-gray-300';
        }
    }

    getVoteStatusIcon(): string {
        switch (this.voteStatus) {
            case 'ACEPTADO': return '✓';
            case 'RECHAZADO': return '✗';
            case 'ACTUALIZA': return '↻';
            default: return '•';
        }
    }
}