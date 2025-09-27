// src/propuestas/application/calculateProposalStatusUseCase.ts
import { PropuestaRepository } from "../domain/interfaces/propuestaRepository";
import { CommentRepository } from "../../propuestas-comentarios/domain/interfaces/commentRepository";
import { ProposalStatus } from "../domain/models/propuesta";

export interface ProposalVoteSummary {
    totalVotes: number;
    acceptedVotes: number;
    rejectedVotes: number;
    updateVotes: number;
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
    } {
        const counts = {
            total: comments.length,
            accepted: 0,
            rejected: 0,
            update: 0
        };

        comments.forEach(comment => {
            switch (comment.getVoteStatus()) {
                case 'ACEPTADO':
                    counts.accepted++;
                    break;
                case 'RECHAZADO':
                    counts.rejected++;
                    break;
                case 'ACTUALIZA':
                    counts.update++;
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
    }): ProposalStatus {
        // REGLA 1: ACTUALIZAR tiene la máxima prioridad
        // Si hay al menos 1 voto de ACTUALIZA, el estado es ACTUALIZAR
        if (voteCounts.update > 0) {
            return 'ACTUALIZAR';
        }

        // REGLA 2: Si hay 3 votos de ACEPTADO, el estado es APROBADO
        if (voteCounts.accepted >= 3) {
            return 'APROBADO';
        }

        // REGLA 3: Si hay 3 votos de RECHAZADO, el estado es RECHAZADO
        if (voteCounts.rejected >= 3) {
            return 'RECHAZADO';
        }

        // REGLA 4: Si hay al menos 1 voto de ACEPTADO o RECHAZADO pero no se cumple ninguna condición de 3 votos
        if (voteCounts.accepted > 0 || voteCounts.rejected > 0) {
            return 'PENDIENTE'; // En el frontend se mostrará como "EVALUANDO"
        }

        // REGLA 5: Si no hay votos, permanece PENDIENTE
        return 'PENDIENTE';
    }

    private isEvaluationClosed(voteCounts: {
        total: number;
        accepted: number;
        rejected: number;
        update: number;
    }): boolean {
        // La evaluación se cierra cuando se alcanzan 3 votos de ACEPTADO o RECHAZADO
        // PERO NO se cierra con votos de ACTUALIZA
        return voteCounts.accepted >= 3 || voteCounts.rejected >= 3;
    }

    async updateProposalStatusIfNeeded(proposalId: string): Promise<boolean> {
        try {
            const voteSummary = await this.run(proposalId);
            
            // Obtener la propuesta actual
            const currentProposal = await this.propuestaRepository.getPropuesta(proposalId);
            if (!currentProposal) {
                throw new Error("Propuesta no encontrada");
            }

            // Solo actualizar si el estado calculado es diferente al actual
            if (currentProposal.getProposalStatus() !== voteSummary.calculatedStatus) {
                await this.propuestaRepository.updateProposalStatus(
                    proposalId, 
                    voteSummary.calculatedStatus
                );
                return true;
            }

            return false;
        } catch (error) {
            console.error("Error updating proposal status:", error);
            throw error;
        }
    }
}

