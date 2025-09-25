// src/propuestas-documentacion/application/uploadDocumentUseCase.ts
import { DocumentRepository, DocumentCreateData } from "../domain/interfaces/documentRepository";
import { ProposalDocument } from "../domain/models/proposalDocument";
import { PropuestaRepository } from "../../propuestas/domain/interfaces/propuestaRepository";
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';

export interface UploadDocumentRequest {
    proposalId: string;
    studentId: number;
    file: {
        originalname: string;
        size: number;
        mimetype: string;
        buffer: Buffer;
    };
}

export class UploadDocumentUseCase {
    constructor(
        private readonly documentRepository: DocumentRepository,
        private readonly propuestaRepository: PropuestaRepository
    ) {}

    async run(request: UploadDocumentRequest): Promise<ProposalDocument | null> {
        try {
            console.log('📄 UploadDocumentUseCase iniciado:', { 
                proposalId: request.proposalId, 
                studentId: request.studentId,
                fileName: request.file.originalname,
                fileSize: request.file.size,
                mimeType: request.file.mimetype
            });

            // Validar que la propuesta existe y está aprobada
            const propuesta = await this.propuestaRepository.getPropuesta(request.proposalId);
            if (!propuesta) {
                throw new Error("Propuesta no encontrada");
            }

            if (propuesta.getProposalStatus() !== 'APROBADO') {
                throw new Error("Solo se pueden cargar documentos en propuestas aprobadas");
            }

            // Validar que el estudiante es el propietario de la propuesta
            if (propuesta.getStudentId() !== request.studentId) {
                throw new Error("No tienes permisos para cargar documentos en esta propuesta");
            }

            // Validar el archivo
            this.validateFile(request.file);

            // Generar nombre único para el archivo
            const fileExtension = path.extname(request.file.originalname);
            const uniqueFileName = `${uuidv4()}${fileExtension}`;
            
            // Crear directorio si no existe
            const uploadDir = path.join(process.cwd(), 'uploads', 'documents');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            // Guardar archivo en el sistema de archivos
            const filePath = path.join(uploadDir, uniqueFileName);
            fs.writeFileSync(filePath, request.file.buffer);

            // Crear registro en la base de datos
            const documentData: DocumentCreateData = {
                proposalId: request.proposalId,
                studentId: request.studentId,
                fileName: uniqueFileName,
                originalFileName: request.file.originalname,
                fileSize: request.file.size,
                mimeType: request.file.mimetype,
                filePath: filePath
            };

            const createdDocument = await this.documentRepository.createDocument(documentData);
            
            if (createdDocument) {
                console.log('✅ Documento cargado exitosamente:', createdDocument.getUuid());
            }

            return createdDocument;
        } catch (error) {
            console.error("Error in UploadDocumentUseCase:", error);
            throw error;
        }
    }

    private validateFile(file: UploadDocumentRequest['file']): void {
        // Validar tipo de archivo (solo PDF)
        if (file.mimetype !== 'application/pdf') {
            throw new Error("Solo se permiten archivos PDF");
        }

        // Validar tamaño del archivo (máximo 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            throw new Error("El archivo no puede ser mayor a 10MB");
        }

        // Validar que el archivo no esté vacío
        if (file.size === 0) {
            throw new Error("El archivo no puede estar vacío");
        }

        // Validar nombre del archivo
        if (!file.originalname || file.originalname.trim() === '') {
            throw new Error("El nombre del archivo es obligatorio");
        }

        // Validar extensión
        const allowedExtensions = ['.pdf'];
        const fileExtension = path.extname(file.originalname).toLowerCase();
        if (!allowedExtensions.includes(fileExtension)) {
            throw new Error("Solo se permiten archivos con extensión .pdf");
        }
    }
}

