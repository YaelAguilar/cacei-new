// src/propuestas-documentacion/domain/interfaces/documentRepository.ts
import { ProposalDocument } from "../models/proposalDocument";

export interface DocumentCreateData {
    proposalId: string;
    studentId: number;
    fileName: string;
    originalFileName: string;
    fileSize: number;
    mimeType: string;
    filePath: string;
}

export interface DocumentUpdateData {
    fileName?: string;
    originalFileName?: string;
    fileSize?: number;
    mimeType?: string;
    filePath?: string;
    active?: boolean;
}

export interface DocumentRepository {
    // Crear un nuevo documento
    createDocument(data: DocumentCreateData): Promise<ProposalDocument | null>;
    
    // Obtener documento por UUID
    getDocument(uuid: string): Promise<ProposalDocument | null>;
    
    // Obtener todos los documentos de una propuesta
    getDocumentsByProposal(proposalId: string): Promise<ProposalDocument[]>;
    
    // Obtener documentos por estudiante
    getDocumentsByStudent(studentId: number): Promise<ProposalDocument[]>;
    
    // Actualizar documento
    updateDocument(uuid: string, data: DocumentUpdateData): Promise<ProposalDocument | null>;
    
    // Eliminar documento (soft delete)
    deleteDocument(uuid: string): Promise<boolean>;
    
    // Verificar si una propuesta tiene documentos
    hasDocuments(proposalId: string): Promise<boolean>;
    
    // Contar documentos de una propuesta
    countDocumentsByProposal(proposalId: string): Promise<number>;
}

