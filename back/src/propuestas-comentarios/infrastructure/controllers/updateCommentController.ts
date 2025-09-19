// src/propuestas-comentarios/infrastructure/controllers/updateCommentController.ts
import { Request, Response } from 'express';
import { UpdateCommentUseCase } from '../../application/updateCommentUseCase';

export class UpdateCommentController {
    constructor(private readonly updateCommentUseCase: UpdateCommentUseCase) {}

    async run(req: Request, res: Response): Promise<void> {
        const { uuid } = req.params;
        const updateData = req.body;

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

            const comment = await this.updateCommentUseCase.run(uuid, updateData);

            if (comment) {
                const formattedComment = {
                    type: "proposal-comment",
                    id: comment.getUuid(),
                    attributes: {
                        proposalId: comment.getProposalId(),
                        tutorId: comment.getTutorId(),
                        sectionName: comment.getSectionName(),
                        subsectionName: comment.getSubsectionName(),
                        commentText: comment.getCommentText(),
                        voteStatus: comment.getVoteStatus(),
                        active: comment.isActive(),
                        createdAt: comment.getCreatedAt(),
                        updatedAt: comment.getUpdatedAt()
                    }
                };

                res.status(200).json({ data: formattedComment });
            } else {
                res.status(404).json({
                    errors: [{
                        status: "404",
                        title: "Comment not found",
                        detail: "No se pudo actualizar el comentario"
                    }]
                });
            }
        } catch (error) {
            console.error("Error in UpdateCommentController:", error);
            
            if (error instanceof Error) {
                const errorMessage = error.message;
                
                const businessErrors = [
                    "Comentario no encontrado",
                    "no puede estar vacío",
                    "debe tener al menos",
                    "No hay campos para actualizar"
                ];
                
                if (businessErrors.some(msg => errorMessage.includes(msg))) {
                    res.status(400).json({
                        errors: [{
                            status: "400",
                            title: "Business Logic Error",
                            detail: errorMessage
                        }]
                    });
                    return;
                }
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