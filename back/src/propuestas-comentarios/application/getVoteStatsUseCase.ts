// src/propuestas-comentarios/application/getVoteStatsUseCase.ts
import { CommentRepository } from "../domain/interfaces/commentRepository";

export interface VoteStats {
    totalVotes: number;
    acceptedVotes: number;
    rejectedVotes: number;
    updateVotes: number;
    generalApprovalVotes: number;
    generalRejectionVotes: number;
    generalUpdateVotes: number;
    specificApprovalVotes: number;
    specificRejectionVotes: number;
    specificUpdateVotes: number;
    evaluationClosed: boolean;
    calculatedStatus: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO' | 'ACTUALIZAR';
}

export class GetVoteStatsUseCase {
    constructor(private readonly commentRepository: CommentRepository) {}

    async run(proposalId: string): Promise<VoteStats> {
        try {
            console.log(`📊 DEBUG: GetVoteStatsUseCase iniciado para propuesta ${proposalId}`);
            
            // Obtener todos los comentarios de la propuesta
            const comments = await this.commentRepository.getCommentsByProposal(proposalId);
            
            if (!comments || comments.length === 0) {
                console.log(`📊 DEBUG: No hay comentarios para la propuesta ${proposalId}`);
                return {
                    totalVotes: 0,
                    acceptedVotes: 0,
                    rejectedVotes: 0,
                    updateVotes: 0,
                    generalApprovalVotes: 0,
                    generalRejectionVotes: 0,
                    generalUpdateVotes: 0,
                    specificApprovalVotes: 0,
                    specificRejectionVotes: 0,
                    specificUpdateVotes: 0,
                    evaluationClosed: false,
                    calculatedStatus: 'PENDIENTE'
                };
            }

            // Contar votos según la lógica implementada
            const voteCounts = this.countVotes(comments);
            
            // Aplicar lógica de estado
            const calculatedStatus = this.calculateStatus(voteCounts);
            
            // Verificar si la evaluación está cerrada
            const evaluationClosed = voteCounts.generalApproval >= 3 || voteCounts.generalRejection >= 3;
            
            const stats: VoteStats = {
                totalVotes: voteCounts.total,
                acceptedVotes: voteCounts.accepted,
                rejectedVotes: voteCounts.rejected,
                updateVotes: voteCounts.update,
                generalApprovalVotes: voteCounts.generalApproval,
                generalRejectionVotes: voteCounts.generalRejection,
                generalUpdateVotes: voteCounts.generalUpdate,
                specificApprovalVotes: voteCounts.specificApproval,
                specificRejectionVotes: voteCounts.specificRejection,
                specificUpdateVotes: voteCounts.specificUpdate,
                evaluationClosed,
                calculatedStatus
            };

            console.log(`📊 DEBUG: Estadísticas calculadas:`, stats);
            return stats;
            
        } catch (error) {
            console.error("❌ Error in GetVoteStatsUseCase:", error);
            throw error;
        }
    }

    private countVotes(comments: any[]): {
        total: number;
        accepted: number;
        rejected: number;
        update: number;
        generalApproval: number;
        generalRejection: number;
        generalUpdate: number;
        specificApproval: number;
        specificRejection: number;
        specificUpdate: number;
    } {
        const counts = {
            total: comments.length,
            accepted: 0,
            rejected: 0,
            update: 0,
            generalApproval: 0,
            generalRejection: 0,
            generalUpdate: 0,
            specificApproval: 0,
            specificRejection: 0,
            specificUpdate: 0
        };

        comments.forEach(comment => {
            const { voteStatus, sectionName, subsectionName } = comment;
            
            // Contar votos por tipo
            if (voteStatus === 'ACEPTADO') counts.accepted++;
            if (voteStatus === 'RECHAZADO') counts.rejected++;
            if (voteStatus === 'ACTUALIZA') counts.update++;

            // Contar votos generales vs específicos
            if (this.isGeneralVote(sectionName, subsectionName)) {
                if (voteStatus === 'ACEPTADO') counts.generalApproval++;
                if (voteStatus === 'RECHAZADO') counts.generalRejection++;
                if (voteStatus === 'ACTUALIZA') counts.generalUpdate++;
            } else {
                if (voteStatus === 'ACEPTADO') counts.specificApproval++;
                if (voteStatus === 'RECHAZADO') counts.specificRejection++;
                if (voteStatus === 'ACTUALIZA') counts.specificUpdate++;
            }
        });

        return counts;
    }

    private isGeneralVote(sectionName: string, subsectionName: string): boolean {
        const generalSections = ['APROBACIÓN_GENERAL', 'PROPUESTA_COMPLETA'];
        const generalSubsections = ['PROPUESTA_COMPLETA', 'RECHAZO_GENERAL'];
        
        return generalSections.includes(sectionName) && 
               generalSubsections.includes(subsectionName);
    }

    private calculateStatus(voteCounts: {
        total: number;
        accepted: number;
        rejected: number;
        update: number;
        generalApproval: number;
        generalRejection: number;
        generalUpdate: number;
        specificApproval: number;
        specificRejection: number;
        specificUpdate: number;
    }): 'PENDIENTE' | 'APROBADO' | 'RECHAZADO' | 'ACTUALIZAR' {
        
        // REGLA 1: Si hay 3 votos de ACEPTADO general, el estado es APROBADO (máxima prioridad)
        if (voteCounts.generalApproval >= 3) {
            return 'APROBADO';
        }

        // REGLA 2: Si hay 3 votos de RECHAZADO general, el estado es RECHAZADO (máxima prioridad)
        if (voteCounts.generalRejection >= 3) {
            return 'RECHAZADO';
        }

        // REGLA 3: Si hay al menos 1 voto de ACTUALIZA (general o específico), el estado es ACTUALIZAR
        if (voteCounts.generalUpdate > 0 || voteCounts.specificUpdate > 0) {
            return 'ACTUALIZAR';
        }

        // REGLA 4: Si hay votos generales pero no se cumplen las condiciones de 3 votos
        if (voteCounts.generalApproval > 0 || voteCounts.generalRejection > 0) {
            return 'PENDIENTE';
        }

        // REGLA 5: Si no hay votos, permanece PENDIENTE
        return 'PENDIENTE';
    }
}


