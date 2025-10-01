// src/propuestas-comentarios/application/syncProposalStatusUseCase.ts
import { CommentRepository } from "../domain/interfaces/commentRepository";
import { PropuestaRepository } from "../../propuestas/domain/interfaces/propuestaRepository";

export class SyncProposalStatusUseCase {
    constructor(
        private readonly commentRepository: CommentRepository,
        private readonly propuestaRepository: PropuestaRepository
    ) {}

    async execute(proposalId: string): Promise<boolean> {
        try {
            console.log(`🔄 Sincronizando estado de propuesta: ${proposalId}`);
            
            // Obtener todos los comentarios de la propuesta
            const comments = await this.commentRepository.getCommentsByProposal(proposalId);
            
            if (!comments || comments.length === 0) {
                console.log(`📊 No hay comentarios para la propuesta ${proposalId}, manteniendo estado PENDIENTE`);
                return true;
            }

            // Contar votos según la lógica implementada
            console.log(`📊 Comentarios obtenidos para conteo:`, comments.length);
            console.log(`📊 Primer comentario:`, comments[0] ? {
                voteStatus: comments[0].getVoteStatus(),
                sectionName: comments[0].getSectionName(),
                subsectionName: comments[0].getSubsectionName()
            } : 'No hay comentarios');
            
            const voteCounts = this.countVotes(comments);
            console.log(`📊 Conteo de votos:`, voteCounts);
            
            // Calcular el estado basado en los votos
            const calculatedStatus = this.calculateStatus(voteCounts);
            
            // Obtener el estado actual de la propuesta
            const currentProposal = await this.propuestaRepository.getPropuesta(proposalId);
            
            if (!currentProposal) {
                console.log(`❌ No se encontró la propuesta ${proposalId}`);
                return false;
            }
            
            const currentStatus = currentProposal.getProposalStatus();
            
            // Solo actualizar si el estado calculado es diferente al actual
            if (calculatedStatus !== currentStatus) {
                console.log(`🔄 Actualizando estado de ${currentStatus} a ${calculatedStatus}`);
                
                const success = await this.propuestaRepository.updateProposalStatus(
                    proposalId, 
                    calculatedStatus
                );
                
                if (success) {
                    console.log(`✅ Estado sincronizado exitosamente: ${calculatedStatus}`);
                    return true;
                } else {
                    console.log(`❌ Error al sincronizar estado`);
                    return false;
                }
            } else {
                console.log(`✅ Estado ya está sincronizado: ${currentStatus}`);
                return true;
            }
            
        } catch (error) {
            console.error("❌ Error in SyncProposalStatusUseCase:", error);
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
        
        // REGLA 1: Si hay 3 votos de ACEPTADO general Y NO hay 3 votos de RECHAZADO general, el estado es APROBADO
        if (voteCounts.generalApproval >= 3 && voteCounts.generalRejection < 3) {
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
