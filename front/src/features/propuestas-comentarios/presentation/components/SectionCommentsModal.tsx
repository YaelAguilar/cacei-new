// src/features/propuestas-comentarios/presentation/components/SectionCommentsModal.tsx
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { CommentsViewModel } from "../viewModels/CommentsViewModel";
import InlineCommentForm from "./InlineCommentForm";
import { ProposalComment } from "../../data/models/ProposalComment";
import { FiMessageSquare, FiUser, FiCalendar, FiRefreshCw, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { AiOutlineClose } from "react-icons/ai";

interface SectionCommentsModalProps {
    isOpen: boolean;
    onClose: () => void;
    viewModel: CommentsViewModel;
    proposalId: string;
    sectionName: string;
    subsectionName: string;
    onCommentSuccess?: () => void;
}

const SectionCommentsModal: React.FC<SectionCommentsModalProps> = observer(({ 
    isOpen, 
    onClose, 
    viewModel, 
    proposalId, 
    sectionName, 
    subsectionName,
    onCommentSuccess 
}) => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [sectionComments, setSectionComments] = useState<ProposalComment[]>([]);

    // Cargar comentarios cuando se abre el modal
    useEffect(() => {
        if (isOpen) {
            loadSectionComments();
        }
    }, [isOpen, proposalId, sectionName, subsectionName]);

    const loadSectionComments = async () => {
        try {
            await viewModel.loadComments(proposalId);
            // Filtrar comentarios por sección
            const filteredComments = viewModel.comments.filter(comment => 
                comment.getSectionName() === sectionName && 
                comment.getSubsectionName() === subsectionName
            );
            setSectionComments(filteredComments);
        } catch (error) {
            console.error('Error loading section comments:', error);
        }
    };

    const handleAddComment = () => {
        setShowAddForm(true);
    };

    const handleCommentSuccess = async () => {
        setShowAddForm(false);
        await loadSectionComments(); // Recargar comentarios
        if (onCommentSuccess) {
            onCommentSuccess();
        }
    };

    const handleCancelAdd = () => {
        setShowAddForm(false);
    };

    const getVoteIcon = (voteStatus: string) => {
        switch (voteStatus) {
            case 'ACEPTADO':
                return <FiCheckCircle className="w-4 h-4 text-green-600" />;
            case 'RECHAZADO':
                return <FiXCircle className="w-4 h-4 text-red-600" />;
            case 'ACTUALIZA':
                return <FiRefreshCw className="w-4 h-4 text-yellow-600" />;
            default:
                return <FiMessageSquare className="w-4 h-4 text-gray-600" />;
        }
    };

    const getVoteColor = (voteStatus: string) => {
        switch (voteStatus) {
            case 'ACEPTADO':
                return 'bg-green-50 border-green-200';
            case 'RECHAZADO':
                return 'bg-red-50 border-red-200';
            case 'ACTUALIZA':
                return 'bg-yellow-50 border-yellow-200';
            default:
                return 'bg-gray-50 border-gray-200';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-xs flex items-center justify-center z-[60]"
            onClick={onClose}
        >
            <div 
                className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto w-[95%] max-h-[85vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">
                            Comentarios de la Sección
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                            {sectionName} - {subsectionName}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <AiOutlineClose className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Comentarios existentes */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-800">
                            Comentarios Existentes ({sectionComments.length})
                        </h4>
                        <button
                            onClick={handleAddComment}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <FiMessageSquare className="w-4 h-4" />
                            Agregar Comentario
                        </button>
                    </div>

                    {sectionComments.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <FiMessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p className="text-lg font-medium">No hay comentarios en esta sección</p>
                            <p className="text-sm">Sé el primero en comentar esta sección</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {sectionComments.map((comment) => (
                                <div 
                                    key={comment.getId()}
                                    className={`p-4 rounded-lg border ${getVoteColor(comment.getVoteStatus())}`}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-2">
                                                {getVoteIcon(comment.getVoteStatus())}
                                        <span className="font-medium text-gray-900">
                                            {comment.getTutorName()}
                                        </span>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {comment.getTutorEmail()}
                                    </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <FiCalendar className="w-4 h-4" />
                                            {formatDate(comment.getCreatedAt().toISOString())}
                                        </div>
                                    </div>
                                    
                                    <div className="mb-3">
                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                            comment.getVoteStatus() === 'ACEPTADO' ? 'bg-green-100 text-green-800' :
                                            comment.getVoteStatus() === 'RECHAZADO' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {getVoteIcon(comment.getVoteStatus())}
                                            {comment.getVoteStatus()}
                                        </span>
                                    </div>
                                    
                                    <div className="text-gray-800 leading-relaxed">
                                        {comment.getCommentText()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Formulario para agregar comentario */}
                {showAddForm && (
                    <div className="border-t pt-6">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-semibold text-gray-800">
                                Agregar Nuevo Comentario
                            </h4>
                            <button
                                onClick={handleCancelAdd}
                                className="text-sm text-gray-600 hover:text-gray-800"
                            >
                                Cancelar
                            </button>
                        </div>
                        
                        <InlineCommentForm
                            viewModel={viewModel}
                            proposalId={proposalId}
                            sectionName={sectionName}
                            subsectionName={subsectionName}
                            onSuccess={handleCommentSuccess}
                            onCancel={handleCancelAdd}
                        />
                    </div>
                )}
            </div>
        </div>
    );
});

export default SectionCommentsModal;
