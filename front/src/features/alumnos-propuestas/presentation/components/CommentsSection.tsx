import React from 'react';
import { FiCheckCircle, FiXCircle, FiRefreshCcw, FiUser, FiMail, FiCalendar } from 'react-icons/fi';

export interface Comment {
    id: string;
    tutorName: string;
    tutorLastName: string;
    tutorSecondLastName: string;
    tutorEmail: string;
    voteStatus: 'ACEPTADO' | 'RECHAZADO' | 'ACTUALIZA';
    sectionName: string;
    subsectionName: string;
    commentText: string;
    createdAt: string;
}

interface CommentsSectionProps {
    comments: Comment[];
    isLoading?: boolean;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({ comments, isLoading = false }) => {
    const getVoteIcon = (voteStatus: string) => {
        switch (voteStatus) {
            case 'ACEPTADO':
                return <FiCheckCircle className="text-green-700 text-lg" />;
            case 'RECHAZADO':
                return <FiXCircle className="text-red-700 text-lg" />;
            case 'ACTUALIZA':
                return <FiRefreshCcw className="text-amber-700 text-lg" />;
            default:
                return <FiUser className="text-gray-600 text-lg" />;
        }
    };

    const getVoteColor = (voteStatus: string) => {
        switch (voteStatus) {
            case 'ACEPTADO':
                return 'border-l-green-600 bg-green-50/80';
            case 'RECHAZADO':
                return 'border-l-red-600 bg-red-50/80';
            case 'ACTUALIZA':
                return 'border-l-amber-600 bg-amber-50/80';
            default:
                return 'border-l-gray-500 bg-gray-50/80';
        }
    };

    const getVoteText = (voteStatus: string) => {
        switch (voteStatus) {
            case 'ACEPTADO':
                return 'Aprobado';
            case 'RECHAZADO':
                return 'Rechazado';
            case 'ACTUALIZA':
                return 'Actualizar';
            default:
                return 'Sin voto';
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

    const isGlobalComment = (comment: Comment) => {
        return comment.sectionName === 'APROBACIÓN_GENERAL' || 
               comment.sectionName === 'PROPUESTA_COMPLETA' ||
               comment.subsectionName === 'PROPUESTA_COMPLETA' ||
               comment.subsectionName === 'RECHAZO_GENERAL';
    };

    const getDisplayText = (comment: Comment) => {
        if (comment.voteStatus === 'ACEPTADO' && (!comment.commentText || comment.commentText.trim() === '')) {
            return '(sin comentarios)';
        }
        return comment.commentText || '(sin comentarios)';
    };

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <FiUser className="mr-3 text-blue-600" />
                    Comentarios y Evaluaciones
                </h3>
                <div className="animate-pulse space-y-5">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="border-l-4 border-gray-300 bg-gray-100 p-5 rounded-r-lg">
                            <div className="flex items-start mb-4">
                                <div className="w-6 h-6 bg-gray-200 rounded-full mr-3"></div>
                                <div className="flex-1">
                                    <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </div>
                            <div className="h-3 bg-gray-200 rounded mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!comments || comments.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <FiUser className="mr-3 text-blue-600" />
                    Comentarios y Evaluaciones
                </h3>
                <div className="text-center py-12 text-gray-600">
                    <FiUser className="mx-auto text-5xl mb-4 text-gray-400" />
                    <p className="text-lg font-semibold mb-2 text-gray-700">No hay comentarios o evaluaciones aún</p>
                    <p className="text-sm text-gray-500">Los tutores académicos aún no han evaluado esta propuesta</p>
                </div>
            </div>
        );
    }

    // Ordenar comentarios por fecha (más recientes primero)
    const sortedComments = [...comments].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <FiUser className="mr-3 text-blue-600" />
                Comentarios y Evaluaciones
                <span className="ml-3 bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-semibold">
                    {comments.length}
                </span>
            </h3>

            <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-2">
                {sortedComments.map((comment) => (
                    <div
                        key={comment.id}
                        className={`border-l-4 p-5 rounded-r-lg ${getVoteColor(comment.voteStatus)}`}
                    >
                        {/* Primera fila: Badge del estado del voto (lado izquierdo) y Fecha (lado derecho) */}
                        <div className="flex justify-between items-center mb-3">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                                {getVoteIcon(comment.voteStatus)}
                                <span className="ml-1">{getVoteText(comment.voteStatus)}</span>
                            </span>
                            <div className="flex items-center text-xs text-gray-500">
                                <FiCalendar className="mr-1" />
                                <span className="whitespace-nowrap">{formatDate(comment.createdAt)}</span>
                            </div>
                        </div>

                        {/* Segunda fila: Nombre completo del tutor académico (lado izquierdo) */}
                        <div className="mb-3">
                            <span className="font-semibold text-gray-900 text-base break-words">
                                {comment.tutorName} {comment.tutorLastName} {comment.tutorSecondLastName}
                            </span>
                        </div>

                        {/* Tercera fila: Correo del tutor académico (lado izquierdo) */}
                        <div className="mb-4">
                            <div className="flex items-center text-sm text-gray-600">
                                <FiMail className="mr-1 flex-shrink-0" />
                                <span className="break-all">{comment.tutorEmail}</span>
                            </div>
                        </div>

                        {/* Información de la sección (si no es comentario global) */}
                        {!isGlobalComment(comment) && (
                            <div className="mb-3">
                                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium">
                                    {comment.sectionName}
                                    {comment.subsectionName && ` → ${comment.subsectionName}`}
                                </span>
                            </div>
                        )}

                        {/* Fila 5: Comentario */}
                        <div className="text-gray-700">
                            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                                {getDisplayText(comment)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Resumen */}
            <div className="mt-6 pt-5 border-t border-gray-200">
                <h4 className="text-sm font-bold text-gray-800 mb-4">Resumen de Evaluaciones</h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200 shadow-sm">
                        <div className="text-green-800 font-bold text-xl">
                            {comments.filter(c => c.voteStatus === 'ACEPTADO').length}
                        </div>
                        <div className="text-green-700 text-sm font-semibold">Aprobados</div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200 shadow-sm">
                        <div className="text-red-800 font-bold text-xl">
                            {comments.filter(c => c.voteStatus === 'RECHAZADO').length}
                        </div>
                        <div className="text-red-700 text-sm font-semibold">Rechazados</div>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 shadow-sm">
                        <div className="text-amber-800 font-bold text-xl">
                            {comments.filter(c => c.voteStatus === 'ACTUALIZA').length}
                        </div>
                        <div className="text-amber-700 text-sm font-semibold">Actualizar</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

