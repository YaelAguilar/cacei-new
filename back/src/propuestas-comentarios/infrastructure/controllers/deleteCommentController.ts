// src/propuestas-comentarios/infrastructure/controllers/deleteCommentController.ts
import { Request, Response } from 'express';
import { DeleteCommentUseCase } from '../../application/deleteCommentUseCase';

export class DeleteCommentController {
    constructor(private readonly deleteCommentUseCase: DeleteCommentUseCase) {}

    async run(req: Request, res: Response): Promise<void> {
        const { uuid } = req.params;

        try {
            if (!uuid) {
                res.status(400).json({
                    errors: [{
                        status: "400",
                        title: "Bad Request",
                        detail: "UUID es obligatorio"
                    }]
                });
                return;
            }

            const deleted = await this.deleteCommentUseCase.run(uuid);

            if (deleted) {
                res.status(200).json({
                    data: {
                        type: "proposal-comment",
                        id: uuid,
                        attributes: {
                            deleted: true,
                            message: "Comentario eliminado exitosamente"
                        }
                    }
                });
            } else {
                res.status(404).json({
                    errors: [{
                        status: "404",
                        title: "Comment not found",
                        detail: "No se pudo eliminar el comentario"
                    }]
                });
            }
        } catch (error) {
            console.error("Error in DeleteCommentController:", error);
            
            if (error instanceof Error && error.message.includes("Comentario no encontrado")) {
                res.status(404).json({
                    errors: [{
                        status: "404",
                        title: "Not Found",
                        detail: error.message
                    }]
                });
                return;
            }
            
            res.status(500).json({
                errors: [{
                    status: "500",
                    title: "Server error",
                    detail: error instanceof Error ? error.message : String(error)
                }]
            });
        }
    }
}