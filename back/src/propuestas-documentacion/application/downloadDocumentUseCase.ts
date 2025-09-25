// src/propuestas-documentacion/application/downloadDocumentUseCase.ts
import { DocumentRepository } from "../domain/interfaces/documentRepository";
import { ProposalDocument } from "../domain/models/proposalDocument";
import { PropuestaRepository } from "../../propuestas/domain/interfaces/propuestaRepository";
import * as fs from 'fs';
import * as path from 'path';

export interface DownloadDocumentResponse {
    document: ProposalDocument;
    fileBuffer: Buffer;
    contentType: string;
}

export class DownloadDocumentUseCase {
    constructor(
        private readonly documentRepository: DocumentRepository,
        private readonly propuestaRepository: PropuestaRepository
    ) {}

    async run(documentUuid: string, requesterId: number, requesterRole: string): Promise<DownloadDocumentResponse> {
        try {
            console.log('📥 DownloadDocumentUseCase iniciado:', { 
                documentUuid, 
                requesterId, 
                requesterRole 
            });

            // Obtener el documento
            const document = await this.documentRepository.getDocument(documentUuid);
            if (!document) {
                throw new Error("Documento no encontrado");
            }

            // Verificar que el archivo existe en el sistema de archivos
            if (!fs.existsSync(document.getFilePath())) {
                throw new Error("El archivo no existe en el servidor");
            }

            // Obtener la propuesta para validar permisos
            const propuesta = await this.propuestaRepository.getPropuesta(document.getProposalId());
            if (!propuesta) {
                throw new Error("Propuesta asociada no encontrada");
            }

            // Verificar permisos de acceso
            this.validateAccess(propuesta, document, requesterId, requesterRole);

            // Leer el archivo
            const fileBuffer = fs.readFileSync(document.getFilePath());
            
            console.log(`✅ Documento ${documentUuid} preparado para descarga`);

            return {
                document,
                fileBuffer,
                contentType: document.getMimeType()
            };
        } catch (error) {
            console.error("Error in DownloadDocumentUseCase:", error);
            throw error;
        }
    }

    private validateAccess(propuesta: any, document: ProposalDocument, requesterId: number, requesterRole: string): void {
        // El estudiante propietario siempre puede descargar sus documentos
        if (document.getStudentId() === requesterId) {
            return;
        }

        // Los tutores académicos pueden descargar documentos de sus tutorados
        if (propuesta.getAcademicTutorId() === requesterId) {
            return;
        }

        // Los directores pueden descargar todos los documentos
        if (requesterRole === 'Director' || requesterRole === 'SUPER-ADMIN') {
            return;
        }

        // Los PTC pueden descargar documentos de propuestas que están evaluando
        if (requesterRole === 'PTC') {
            return; // Por ahora permitimos que todos los PTC descarguen todos los documentos
        }

        throw new Error("No tienes permisos para descargar este documento");
    }
}

