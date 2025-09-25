// src/propuestas-documentacion/application/getDocumentsByProposalUseCase.ts
import { DocumentRepository } from "../domain/interfaces/documentRepository";
import { ProposalDocument } from "../domain/models/proposalDocument";
import { PropuestaRepository } from "../../propuestas/domain/interfaces/propuestaRepository";

export class GetDocumentsByProposalUseCase {
    constructor(
        private readonly documentRepository: DocumentRepository,
        private readonly propuestaRepository: PropuestaRepository
    ) {}

    async run(proposalId: string, requesterId: number, requesterRole: string): Promise<ProposalDocument[]> {
        try {
            console.log('📄 GetDocumentsByProposalUseCase iniciado:', { 
                proposalId, 
                requesterId, 
                requesterRole 
            });

            // Verificar que la propuesta existe
            const propuesta = await this.propuestaRepository.getPropuesta(proposalId);
            if (!propuesta) {
                throw new Error("Propuesta no encontrada");
            }

            // Verificar permisos de acceso
            this.validateAccess(propuesta, requesterId, requesterRole);

            // Obtener documentos
            const documents = await this.documentRepository.getDocumentsByProposal(proposalId);
            
            console.log(`✅ Se encontraron ${documents.length} documentos para la propuesta ${proposalId}`);
            
            return documents;
        } catch (error) {
            console.error("Error in GetDocumentsByProposalUseCase:", error);
            throw error;
        }
    }

    private validateAccess(propuesta: any, requesterId: number, requesterRole: string): void {
        // El estudiante propietario siempre puede ver sus documentos
        if (propuesta.getStudentId() === requesterId) {
            return;
        }

        // Los tutores académicos pueden ver documentos de sus tutorados
        if (propuesta.getAcademicTutorId() === requesterId) {
            return;
        }

        // Los directores pueden ver todos los documentos
        if (requesterRole === 'Director' || requesterRole === 'SUPER-ADMIN') {
            return;
        }

        // Los PTC pueden ver documentos de propuestas que están evaluando
        if (requesterRole === 'PTC') {
            return; // Por ahora permitimos que todos los PTC vean todos los documentos
        }

        throw new Error("No tienes permisos para acceder a estos documentos");
    }
}

