// src/features/propuestas-comentarios/presentation/components/InlineCommentCard.tsx
import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { ProposalComment } from "../../data/models/ProposalComment";
import { CommentsViewModel } from "../viewModels/CommentsViewModel";
import VoteStatusBadge from "./VoteStatusBadge";
import { FiEdit2, FiUser } from "react-icons/fi";
import InlineCommentEditForm from "./InlineCommentEditForm";

interface InlineCommentCardProps {
    comment: ProposalComment;
    viewModel: CommentsViewModel;
    currentUserEmail?: string;
    canEdit?: boolean;
}

const InlineCommentCard: React.FC<InlineCommentCardProps> = observer(({ 
    comment, 
    viewModel,
    currentUserEmail,
    canEdit = false
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const isOwnComment = currentUserEmail === comment.getTutorEmail();
    const canEditThisComment = isOwnComment && canEdit && viewModel.canEditComment(comment);

    if (isEditing) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <InlineCommentEditForm
                    comment={comment}
                    viewModel={viewModel}
                    onSuccess={() => setIsEditing(false)}
                    onCancel={() => setIsEditing(false)}
                />
            </div>
        );
    }

    return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                        <FiUser className="w-3 h-3 text-indigo-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-900">{comment.getTutorName()}</p>
                        <p className="text-xs text-gray-500">{comment.getTutorEmail()}</p>
                        <p className="text-xs text-gray-500">{viewModel.formatDate(comment.getCreatedAt())}</p>
                    </div>
                </div>
                
                <VoteStatusBadge status={comment.getVoteStatus()} size="sm" showIcon={false} />
            </div>

            <p className="text-sm text-gray-700 mb-2">{comment.getCommentText()}</p>

            {/* Mostrar botón de editar solo para comentarios ACTUALIZA */}
            {canEditThisComment && (
                <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                    <button
                        onClick={() => setIsEditing(true)}
                        className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                        <FiEdit2 className="w-3 h-3" />
                        Editar
                    </button>
                </div>
            )}

            {/* Mensaje informativo para comentarios no editables */}
            {isOwnComment && !canEditThisComment && comment.getVoteStatus() !== 'ACTUALIZA' && (
                <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
                    Los comentarios "{comment.getVoteStatus()}" no se pueden editar
                </div>
            )}
        </div>
    );
});

export default InlineCommentCard;