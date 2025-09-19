// src/features/propuestas-comentarios/presentation/components/SubsectionComments.tsx
import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { CommentsViewModel } from "../viewModels/CommentsViewModel";
import CommentsList from "./CommentsList";
import VoteStatusBadge from "./VoteStatusBadge";
import { FiChevronDown, FiChevronRight, FiPlus, FiMessageSquare } from "react-icons/fi";

interface SubsectionCommentsProps {
    viewModel: CommentsViewModel;
    proposalId: string;
    sectionName: string;
    subsectionName: string;
    subsectionContent?: React.ReactNode;
    currentUserEmail?: string;
    canComment?: boolean;
    canEdit?: boolean;
    canDelete?: boolean;
}

const SubsectionComments: React.FC<SubsectionCommentsProps> = observer(({ 
    viewModel,
    sectionName, 
    subsectionName,
    subsectionContent,
    currentUserEmail,
    canComment = false,
    canEdit = false,
    canDelete = false
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const subsectionStatus = viewModel.getSubsectionStatus(sectionName, subsectionName);

    const handleAddComment = () => {
        viewModel.openCommentModal(sectionName, subsectionName);
    };

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Header - Subsección */}
            <div className="bg-gray-50 p-4">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex items-center gap-3 flex-1 text-left hover:text-blue-600 transition-colors"
                    >
                        {isExpanded ? (
                            <FiChevronDown className="w-5 h-5 text-gray-400" />
                        ) : (
                            <FiChevronRight className="w-5 h-5 text-gray-400" />
                        )}
                        <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{subsectionName}</h4>
                            {subsectionStatus.hasComments && (
                                <p className="text-sm text-gray-500 mt-1">
                                    {subsectionStatus.count} comentario{subsectionStatus.count !== 1 ? 's' : ''}
                                </p>
                            )}
                        </div>
                    </button>

                    <div className="flex items-center gap-3">
                        <VoteStatusBadge status={subsectionStatus.status} size="sm" />
                        
                        {canComment && (
                            <button
                                onClick={handleAddComment}
                                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                                <FiPlus className="w-4 h-4" />
                                Comentar
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Contenido expandible */}
            {isExpanded && (
                <div className="p-4 space-y-4">
                    {/* Contenido de la subsección (opcional) */}
                    {subsectionContent && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            {subsectionContent}
                        </div>
                    )}

                    {/* Lista de comentarios */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <FiMessageSquare className="w-5 h-5 text-gray-500" />
                            <h5 className="font-semibold text-gray-900">Comentarios</h5>
                        </div>
                        
                        <CommentsList
                            viewModel={viewModel}
                            sectionName={sectionName}
                            subsectionName={subsectionName}
                            currentUserEmail={currentUserEmail}
                            canEdit={canEdit}
                            canDelete={canDelete}
                        />
                    </div>
                </div>
            )}
        </div>
    );
});

export default SubsectionComments;