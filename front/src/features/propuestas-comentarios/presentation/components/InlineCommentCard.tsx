// src/features/propuestas-comentarios/presentation/components/InlineCommentCard.tsx
import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { ProposalComment } from "../../data/models/ProposalComment";
import { CommentsViewModel } from "../viewModels/CommentsViewModel";
import VoteStatusBadge from "./VoteStatusBadge";
import { FiEdit2, FiTrash2, FiUser } from "react-icons/fi";
import InlineCommentEditForm from "./InlineCommentEditForm";

interface InlineCommentCardProps {
    comment: ProposalComment;
    viewModel: CommentsViewModel;
    currentUserEmail?: string;
    canEdit?: boolean;
    canDelete?: boolean;
}

const InlineCommentCard: React.FC<InlineCommentCardProps> = observer(({ 
    comment, 
    viewModel,
    currentUserEmail,
    canEdit = false,
    canDelete = false
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const isOwnComment = currentUserEmail === comment.getTutorEmail();

    const handleDelete = async () => {
        if (window.confirm('¿Eliminar este comentario?')) {
            await viewModel.deleteComment(comment.getId());
        }
    };

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
                        <p className="text-xs text-gray-500">{viewModel.formatDate(comment.getCreatedAt())}</p>
                    </div>
                </div>
                
                <VoteStatusBadge status={comment.getVoteStatus()} size="sm" showIcon={false} />
            </div>

            <p className="text-sm text-gray-700 mb-2">{comment.getCommentText()}</p>

            {isOwnComment && (canEdit || canDelete) && (
                <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                    {canEdit && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        >
                            <FiEdit2 className="w-3 h-3" />
                            Editar
                        </button>
                    )}
                    {canDelete && (
                        <button
                            onClick={handleDelete}
                            className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1"
                        >
                            <FiTrash2 className="w-3 h-3" />
                            Eliminar
                        </button>
                    )}
                </div>
            )}
        </div>
    );
});

export default InlineCommentCard;