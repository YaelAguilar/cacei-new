// src/propuestas/application/calculateProposalStatusUseCase.ts
import { PropuestaRepository } from "../domain/interfaces/propuestaRepository";
import { CommentRepository } from "../../propuestas-comentarios/domain/interfaces/commentRepository";
import { ProposalStatus } from "../domain/models/propuesta";

export interface ProposalVoteSummary {
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
    calculatedStatus: ProposalStatus;
}

export class CalculateProposalStatusUseCase {
    constructor(
        private readonly propuestaRepository: PropuestaRepository,
        private readonly commentRepository: CommentRepository
    ) {}

    async run(proposalId: string): Promise<ProposalVoteSummary> {
        try {
            // Obtener todos los comentarios de la propuesta
            const comments = await this.commentRepository.getCommentsByProposal(proposalId);
            
            if (!comments || comments.length === 0) {
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

            // Contar votos por tipo
            const voteCounts = this.countVotes(comments);
            
            // Calcular el estado según las reglas de negocio
            const calculatedStatus = this.calculateStatus(voteCounts);
            
            // Determinar si la evaluación está cerrada
            const evaluationClosed = this.isEvaluationClosed(voteCounts);

            return {
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
        } catch (error) {
            console.error("Error in CalculateProposalStatusUseCase:", error);
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
            const voteStatus = comment.getVoteStatus();
            const sectionName = comment.getSectionName();
            const subsectionName = comment.getSubsectionName();
            
            // Determinar si es un voto general o específico
            const isGeneralVote = this.isGeneralVote(sectionName, subsectionName);
            
            // Contar votos totales
            switch (voteStatus) {
                case 'ACEPTADO':
                    counts.accepted++;
                    if (isGeneralVote) {
                        counts.generalApproval++;
                    } else {
                        counts.specificApproval++;
                    }
                    break;
                case 'RECHAZADO':
                    counts.rejected++;
                    if (isGeneralVote) {
                        counts.generalRejection++;
                    } else {
                        counts.specificRejection++;
                    }
                    break;
                case 'ACTUALIZA':
                    counts.update++;
                    if (isGeneralVote) {
                        counts.generalUpdate++;
                    } else {
                        counts.specificUpdate++;
                    }
                    break;
            }
        });

        return counts;
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
    }): ProposalStatus {
        
        // REGLA 1: Si hay 3 votos de ACEPTADO general, el estado es APROBADO (máxima prioridad)
        if (voteCounts.generalApproval >= 3) {
            return 'APROBADO';
        }

        // REGLA 2: Si hay 3 votos de RECHAZADO general, el estado es RECHAZADO (máxima prioridad)
        if (voteCounts.generalRejection >= 3) {
            return 'RECHAZADO';
        }

        // REGLA 3: Si hay al menos 1 voto de ACTUALIZA (general o específico), el estado es ACTUALIZAR
        // PERO solo si no se han cumplido las condiciones de APROBADO/RECHAZADO
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

    private isEvaluationClosed(voteCounts: {
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
    }): boolean {
        // La evaluación se cierra SOLO cuando se alcanzan 3 votos generales de ACEPTADO o RECHAZADO
        // Los votos de ACTUALIZAR NO cierran la evaluación
        return voteCounts.generalApproval >= 3 || voteCounts.generalRejection >= 3;
    }

    /**
     * Determina si un voto es general (para toda la propuesta) o específico (para una sección)
     */
    private isGeneralVote(sectionName: string, subsectionName: string): boolean {
        // Votos generales son aquellos que afectan toda la propuesta
        const generalSections = [
            'APROBACIÓN_GENERAL',
            'PROPUESTA_COMPLETA',
            'RECHAZO_GENERAL'
        ];
        
        const generalSubsections = [
            'PROPUESTA_COMPLETA',
            'RECHAZO_GENERAL'
        ];
        
        return generalSections.includes(sectionName) || 
               generalSubsections.includes(subsectionName);
    }

    async updateProposalStatusIfNeeded(proposalId: string): Promise<boolean> {
        try {
            console.log(`🔄 DEBUG: updateProposalStatusIfNeeded() iniciado para propuesta ${proposalId}`);
            
            const voteSummary = await this.run(proposalId);
            console.log(`📊 DEBUG: Vote summary calculado:`, voteSummary);
            
            // Obtener la propuesta actual
            const currentProposal = await this.propuestaRepository.getPropuesta(proposalId);
            if (!currentProposal) {
                throw new Error("Propuesta no encontrada");
            }

            const currentStatus = currentProposal.getProposalStatus();
            console.log(`📊 DEBUG: Estado actual: ${currentStatus}, Estado calculado: ${voteSummary.calculatedStatus}`);

            // Solo actualizar si el estado calculado es diferente al actual
            if (currentStatus !== voteSummary.calculatedStatus) {
                console.log(`🔄 DEBUG: Actualizando estado de ${currentStatus} a ${voteSummary.calculatedStatus}`);
                await this.propuestaRepository.updateProposalStatus(
                    proposalId, 
                    voteSummary.calculatedStatus
                );
                console.log(`✅ DEBUG: Estado actualizado exitosamente`);
                return true;
            }

            console.log(`ℹ️ DEBUG: No se requiere actualización`);
            return false;
        } catch (error) {
            console.error("❌ DEBUG: Error updating proposal status:", error);
            throw error;
        }
    }
}

