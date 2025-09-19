// src/features/propuestas-comentarios/presentation/components/CommentsSummary.tsx
import React from "react";
import { observer } from "mobx-react-lite";
import { CommentsViewModel } from "../viewModels/CommentsViewModel";
import { FiCheckCircle, FiXCircle, FiRefreshCw, FiMessageSquare } from "react-icons/fi";

interface CommentsSummaryProps {
    viewModel: CommentsViewModel;
}

const CommentsSummary: React.FC<CommentsSummaryProps> = observer(({ viewModel }) => {
    const stats = viewModel.statistics;

    if (!viewModel.hasComments) {
        return null;
    }

    return (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <FiMessageSquare className="w-5 h-5 text-indigo-600" />
                    <h4 className="font-semibold text-indigo-900">
                        Resumen de Revisión
                    </h4>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-sm">
                        <FiCheckCircle className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-green-700">{stats.approved}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                        <FiXCircle className="w-4 h-4 text-red-600" />
                        <span className="font-medium text-red-700">{stats.rejected}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                        <FiRefreshCw className="w-4 h-4 text-yellow-600" />
                        <span className="font-medium text-yellow-700">{stats.needsUpdate}</span>
                    </div>
                </div>
            </div>

            <p className="text-sm text-indigo-700 mt-2">
                Total de {stats.total} comentario{stats.total !== 1 ? 's' : ''} en esta propuesta
            </p>
        </div>
    );
});

export default CommentsSummary;