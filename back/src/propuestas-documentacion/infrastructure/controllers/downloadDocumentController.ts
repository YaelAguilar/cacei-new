// src/propuestas-documentacion/infrastructure/controllers/downloadDocumentController.ts
import { Request, Response } from 'express';
import { DownloadDocumentUseCase } from '../../application/downloadDocumentUseCase';

export class DownloadDocumentController {
    constructor(private readonly downloadDocumentUseCase: DownloadDocumentUseCase) {}

    async run(req: Request, res: Response): Promise<void> {
        console.log('🏁 DownloadDocumentController iniciado');
        console.log('📝 Params recibidos:', req.params);
        
        try {
            // Obtener el ID del usuario del token JWT
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

            // Obtener información completa del usuario desde la base de datos
            const { query } = await import('../../../database/mysql');
            const userResult = await query(
                'SELECT u.id, u.name, u.lastName, u.secondLastName, u.email, r.name as role_name FROM users u LEFT JOIN role_users ru ON u.id = ru.id_user LEFT JOIN roles r ON ru.id_role = r.id WHERE u.uuid = ? AND u.active = true', 
                [userFromToken.uuid]
            );
            
            if (userResult.length === 0) {
                console.log('❌ Usuario no encontrado en BD');
                res.status(404).json({
                    errors: [{
                        status: "404",
                        title: "User not found",
                        detail: "Usuario no encontrado"
                    }]
                });
                return;
            }

            const user = userResult[0];
            console.log('✅ Información completa del usuario obtenida:', {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role_name
            });

            // Obtener el documentUuid de los parámetros
            const { documentUuid } = req.params;
            if (!documentUuid) {
                res.status(400).json({
                    errors: [{
                        status: "400",
                        title: "Bad Request",
                        detail: "El UUID del documento es obligatorio"
                    }]
                });
                return;
            }

            // Ejecutar el caso de uso
            const downloadResponse = await this.downloadDocumentUseCase.run(
                documentUuid,
                user.id,
                user.role_name
            );

            console.log(`✅ Documento ${documentUuid} preparado para descarga`);

            // Configurar headers para la descarga
            res.setHeader('Content-Type', downloadResponse.contentType);
            res.setHeader('Content-Disposition', `attachment; filename="${downloadResponse.document.getOriginalFileName()}"`);
            res.setHeader('Content-Length', downloadResponse.document.getFileSize().toString());

            // Enviar el archivo
            res.send(downloadResponse.fileBuffer);

        } catch (error: any) {
            console.error("Error in DownloadDocumentController:", error);
            
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
