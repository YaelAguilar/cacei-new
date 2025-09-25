// src/propuestas-documentacion/infrastructure/controllers/uploadDocumentController.ts
import { Request, Response } from 'express';
import { UploadDocumentUseCase } from '../../application/uploadDocumentUseCase';

export class UploadDocumentController {
    constructor(private readonly uploadDocumentUseCase: UploadDocumentUseCase) {}

    async run(req: Request, res: Response): Promise<void> {
        console.log('🏁 UploadDocumentController iniciado');
        console.log('📄 Files recibidos:', req.files);
        console.log('📝 Body recibido:', req.body);
        
        try {
            // Obtener el ID del estudiante del token JWT
            const userFromToken = (req as any).user;
            
            if (!userFromToken || !userFromToken.uuid) {
                console.log('❌ Token inválido');
                res.status(401).json({
                    errors: [{
                        status: "401",
                        title: "Unauthorized",
                        detail: "Token de usuario inválido"
                    }]
                });
                return;
            }

            console.log('✅ Token válido, UUID:', userFromToken.uuid);

            // Obtener información completa del estudiante desde la base de datos
            const { query } = await import('../../../database/mysql');
            const studentResult = await query(
                'SELECT id, name, lastName, secondLastName, email FROM users WHERE uuid = ? AND active = true', 
                [userFromToken.uuid]
            );
            
            if (studentResult.length === 0) {
                console.log('❌ Estudiante no encontrado en BD');
                res.status(404).json({
                    errors: [{
                        status: "404",
                        title: "User not found",
                        detail: "Estudiante no encontrado"
                    }]
                });
                return;
            }

            const student = studentResult[0];
            console.log('✅ Información completa del estudiante obtenida:', {
                id: student.id,
                name: student.name,
                email: student.email
            });

            // Validar que se recibió un archivo
            if (!req.file) {
                res.status(400).json({
                    errors: [{
                        status: "400",
                        title: "Bad Request",
                        detail: "No se recibió ningún archivo"
                    }]
                });
                return;
            }

            // Validar que se recibió el proposalId
            const { proposalId } = req.body;
            if (!proposalId) {
                res.status(400).json({
                    errors: [{
                        status: "400",
                        title: "Bad Request",
                        detail: "El ID de la propuesta es obligatorio"
                    }]
                });
                return;
            }

            // Preparar datos para el caso de uso
            const uploadRequest = {
                proposalId,
                studentId: student.id,
                file: {
                    originalname: req.file.originalname,
                    size: req.file.size,
                    mimetype: req.file.mimetype,
                    buffer: req.file.buffer
                }
            };

            // Ejecutar el caso de uso
            const uploadedDocument = await this.uploadDocumentUseCase.run(uploadRequest);

            if (uploadedDocument) {
                console.log('✅ Documento cargado exitosamente:', uploadedDocument.getUuid());
                
                res.status(201).json({
                    data: {
                        type: "document",
                        id: uploadedDocument.getUuid(),
                        attributes: {
                            fileName: uploadedDocument.getOriginalFileName(),
                            fileSize: uploadedDocument.getFileSize(),
                            fileSizeFormatted: uploadedDocument.getFileSizeFormatted(),
                            mimeType: uploadedDocument.getMimeType(),
                            uploadedAt: uploadedDocument.getUploadedAt().toISOString(),
                            proposalId: uploadedDocument.getProposalId()
                        }
                    }
                });
            } else {
                throw new Error("No se pudo cargar el documento");
            }

        } catch (error: any) {
            console.error("Error in UploadDocumentController:", error);
            
            res.status(500).json({
                errors: [{
                    status: "500",
                    title: "Internal Server Error",
                    detail: error.message || "Error interno del servidor"
                }]
            });
        }
    }
}
