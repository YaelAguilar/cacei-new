// src/features/propuestas-comentarios/presentation/components/CommentCard.tsx
import React from "react";
import { observer } from "mobx-react-lite";
import { ProposalComment } from "../../data/models/ProposalComment";
import VoteStatusBadge from "./VoteStatusBadge";
import { FiEdit2, FiUser, FiClock } from "react-icons/fi";
import { CommentsViewModel } from "../viewModels/CommentsViewModel";

interface CommentCardProps {
    comment: ProposalComment;
    viewModel: CommentsViewModel;
    canEdit?: boolean;
    currentUserEmail?: string;
}

const CommentCard: React.FC<CommentCardProps> = observer(({ 
    comment, 
    viewModel, 
    canEdit = false,
    currentUserEmail
}) => {
    const isOwnComment = currentUserEmail === comment.getTutorEmail();
    const canEditThisComment = isOwnComment && canEdit && viewModel.canEditComment(comment);

    const handleEdit = () => {
        if (canEditThisComment) {
            viewModel.openEditModal(comment);
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <FiUser className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900">{comment.getTutorName()}</p>
                        <p className="text-sm text-gray-500">{comment.getTutorEmail()}</p>
                    </div>
                </div>
                
                <VoteStatusBadge status={comment.getVoteStatus()} size="sm" />
            </div>

            {/* Subsección */}
            <div className="mb-3">
                <p className="text-xs text-gray-500 font-medium">
                    {comment.getSectionName()} › {comment.getSubsectionName()}
                </p>
            </div>

            {/* Comentario */}
            <div className="mb-3">
                <p className="text-gray-700 leading-relaxed">{comment.getCommentText()}</p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <FiClock className="w-3 h-3" />
                    {viewModel.formatDate(comment.getCreatedAt())}
                </div>

                {/* Acciones (solo edición para comentarios ACTUALIZA) */}
                {canEditThisComment && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleEdit}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="Editar comentario (solo disponible para comentarios de 'ACTUALIZA')"
                        >
                            <FiEdit2 className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Mensaje informativo para comentarios no editables */}
                {isOwnComment && !canEditThisComment && comment.getVoteStatus() !== 'ACTUALIZA' && (
                    <div className="text-xs text-gray-500">
                        Los comentarios "{comment.getVoteStatus()}" no se pueden editar
                    </div>
                )}
            </div>
        </div>
    );
});

export default CommentCard;