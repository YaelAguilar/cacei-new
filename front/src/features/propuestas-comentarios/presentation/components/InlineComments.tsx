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
    
    // ✅ NUEVO: Verificar si el tutor actual ya comentó en esta SECCIÓN
    const hasTutorCommentedInSection = currentUserEmail ? 
        viewModel.hasTutorCommentInSection(sectionName, currentUserEmail) : false;
    
    // ✅ NUEVO: Verificar si la propuesta está completamente aprobada
    const isFullyApproved = viewModel.isProposalFullyApproved;

    console.log('🔍 InlineComments - proposalId:', proposalId);

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
                    
                    {/* ❌ ELIMINADO: Botón para aprobar toda la propuesta */}
                    
                    {/* Botón para agregar comentario específico */}
                    {canComment && isExpanded && !showForm && !isFullyApproved && !hasTutorCommentedInSection && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                            <FiPlus className="w-3 h-3" />
                            Comentar
                        </button>
                    )}
                </div>
            </div>

            {/* Mensajes informativos */}
            {canComment && isExpanded && hasTutorCommentedInSection && (
                <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                    <strong>Nota:</strong> Ya has realizado un comentario en la sección "{sectionName}". 
                    Solo se permite un comentario por sección por tutor.
                </div>
            )}

            {isFullyApproved && (
                <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-800">
                    <strong>✅ Propuesta Aprobada:</strong> Esta propuesta ha sido aprobada en su totalidad.
                </div>
            )}

            {/* Error de aprobación - Solo mostrar errores relacionados con comentarios, no con aprobación general */}
            {viewModel.error && !viewModel.error.includes("aprobar") && (
                <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                    <strong>❌ Error:</strong> {viewModel.error}
                </div>
            )}

            {/* Contenido Expandible */}
            {isExpanded && (
                <div className="space-y-3">
                    {/* Formulario Inline */}
                    {showForm && !isFullyApproved && !hasTutorCommentedInSection && (
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