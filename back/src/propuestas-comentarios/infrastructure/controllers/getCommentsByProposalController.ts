// src/propuestas-comentarios/infrastructure/controllers/getCommentsByProposalController.ts
import { Request, Response } from 'express';
import { GetCommentsByProposalUseCase } from '../../application/getCommentsByProposalUseCase';

export class GetCommentsByProposalController {
    constructor(private readonly getCommentsByProposalUseCase: GetCommentsByProposalUseCase) {}

    async run(req: Request, res: Response): Promise<void> {
        console.log('🎯 getCommentsByProposalController.run() called');
        console.log('📦 req.params:', req.params);

        const { proposalId } = req.params;
        console.log('📦 proposalId extraído:', proposalId);

        try {
            const comments = await this.getCommentsByProposalUseCase.run(proposalId);
             console.log('📥 Comentarios obtenidos:', comments?.length || 0);

            const formattedComments = comments ? comments.map(comment => ({
                id: comment.getUuid(),
                proposalId: comment.getProposalId(),
                tutorId: comment.getTutorId(),
                tutorName: comment.getTutorName(),
                tutorLastName: comment.getTutorLastName(),
                tutorSecondLastName: comment.getTutorSecondLastName(),
                tutorEmail: comment.getTutorEmail(),
                sectionName: comment.getSectionName(),
                subsectionName: comment.getSubsectionName(),
                commentText: comment.getCommentText(),
                voteStatus: comment.getVoteStatus(),
                active: comment.isActive(),
                createdAt: comment.getCreatedAt(),
                updatedAt: comment.getUpdatedAt()
            })) : [];

            res.status(200).json({ 
                success: true,
                data: formattedComments 
            });
        } catch (error) {
            console.error("Error in GetCommentsByProposalController:", error);
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