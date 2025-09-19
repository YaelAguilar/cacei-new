// src/features/propuestas-comentarios/presentation/components/CommentsList.tsx
import React from "react";
import { observer } from "mobx-react-lite";
import { CommentsViewModel } from "../viewModels/CommentsViewModel";
import CommentCard from "./CommentCard";
import { FiMessageSquare } from "react-icons/fi";

interface CommentsListProps {
    viewModel: CommentsViewModel;
    sectionName: string;
    subsectionName: string;
    currentUserEmail?: string;
    canEdit?: boolean;
    canDelete?: boolean;
}

const CommentsList: React.FC<CommentsListProps> = observer(({ 
    viewModel, 
    sectionName, 
    subsectionName,
    currentUserEmail,
    canEdit = false,
    canDelete = false
}) => {
    const comments = viewModel.getCommentsForSubsection(sectionName, subsectionName);

    if (comments.length === 0) {
        return (
            <div className="text-center py-8">
                <FiMessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                <p className="text-sm text-gray-500">
                    No hay comentarios para esta subsección
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {comments.map((comment) => (
                <CommentCard
                    key={comment.getId()}
                    comment={comment}
                    viewModel={viewModel}
                    canEdit={canEdit}
                    canDelete={canDelete}
                    currentUserEmail={currentUserEmail}
                />
            ))}
        </div>
    );
});

export default CommentsList;