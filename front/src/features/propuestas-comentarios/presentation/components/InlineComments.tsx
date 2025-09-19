// src/features/propuestas-comentarios/presentation/components/InlineComments.tsx
import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { CommentsViewModel } from "../viewModels/CommentsViewModel";
import VoteStatusBadge from "./VoteStatusBadge";
import { FiMessageSquare, FiPlus, FiChevronDown, FiChevronRight } from "react-icons/fi";
import InlineCommentCard from "./InlineCommentCard";
import InlineCommentForm from "./InlineCommentForm";

interface InlineCommentsProps {
    viewModel: CommentsViewModel;
    proposalId: string;
    sectionName: string;
    subsectionName: string;
    currentUserEmail?: string;
    canComment?: boolean;
}

const InlineComments: React.FC<InlineCommentsProps> = observer(({ 
    viewModel, 
    proposalId,
    sectionName, 
    subsectionName,
    currentUserEmail,
    canComment = false
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showForm, setShowForm] = useState(false);
    
    const comments = viewModel.getCommentsForSubsection(sectionName, subsectionName);
    const subsectionStatus = viewModel.getSubsectionStatus(sectionName, subsectionName);

    // AGREGAR validación
    console.log('🔍 InlineComments - proposalId:', proposalId); // ← AGREGAR PARA DEBUG

    return (
        <div className="mt-4 border-t border-gray-200 pt-4">
            {/* Header de Comentarios */}
            <div className="flex items-center justify-between mb-3">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                    {isExpanded ? (
                        <FiChevronDown className="w-4 h-4" />
                    ) : (
                        <FiChevronRight className="w-4 h-4" />
                    )}
                    <FiMessageSquare className="w-4 h-4" />
                    <span>
                        Comentarios {comments.length > 0 && `(${comments.length})`}
                    </span>
                </button>

                <div className="flex items-center gap-2">
                    <VoteStatusBadge status={subsectionStatus.status} size="sm" />
                    
                    {canComment && isExpanded && !showForm && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                            <FiPlus className="w-3 h-3" />
                            Agregar
                        </button>
                    )}
                </div>
            </div>

            {/* Contenido Expandible */}
            {isExpanded && (
                <div className="space-y-3">
                    {/* Formulario Inline */}
                    {showForm && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <InlineCommentForm
                                viewModel={viewModel}
                                proposalId={proposalId}
                                sectionName={sectionName}
                                subsectionName={subsectionName}
                                onSuccess={() => setShowForm(false)}
                                onCancel={() => setShowForm(false)}
                            />
                        </div>
                    )}

                    {/* Lista de Comentarios */}
                    {comments.length > 0 ? (
                        <div className="space-y-2">
                            {comments.map((comment) => (
                                <InlineCommentCard
                                    key={comment.getId()}
                                    comment={comment}
                                    viewModel={viewModel}
                                    currentUserEmail={currentUserEmail}
                                    canEdit={canComment}
                                    canDelete={canComment}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 text-center py-4">
                            No hay comentarios en esta subsección
                        </p>
                    )}
                </div>
            )}
        </div>
    );
});

export default InlineComments;