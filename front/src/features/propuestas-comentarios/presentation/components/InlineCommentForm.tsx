// src/features/propuestas-comentarios/presentation/components/InlineCommentForm.tsx
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { observer } from "mobx-react-lite";
import { CommentsViewModel } from "../viewModels/CommentsViewModel";
import { CommentValidationSchema } from "../validations/CommentSchema";
import { FiCheckCircle, FiXCircle, FiRefreshCw } from "react-icons/fi";

interface InlineCommentFormProps {
    viewModel: CommentsViewModel;
    proposalId: string;
    sectionName: string;
    subsectionName: string;
    onSuccess?: () => void;
    onCancel?: () => void;
}

const InlineCommentForm: React.FC<InlineCommentFormProps> = observer(({ 
    viewModel, 
    proposalId, 
    sectionName, 
    subsectionName,
    onSuccess,
    onCancel 
}) => {
    const initialValues = {
        commentText: "",
        voteStatus: "" as 'ACEPTADO' | 'RECHAZADO' | 'ACTUALIZA' | ""
    };

    const handleSubmit = async (values: any) => {
        console.log('📝 InlineCommentForm - proposalId:', proposalId);
        console.log('📝 InlineCommentForm - values:', values);

        const success = await viewModel.createComment({
            proposalId,
            sectionName,
            subsectionName,
            commentText: values.commentText,
            voteStatus: values.voteStatus
        });

        if (success && onSuccess) {
            onSuccess();
        }
    };

    const voteOptions = [
        { value: 'ACEPTADO', label: '✓', icon: <FiCheckCircle />, color: 'bg-green-600' },
        { value: 'RECHAZADO', label: '✗', icon: <FiXCircle />, color: 'bg-red-600' },
        { value: 'ACTUALIZA', label: '↻', icon: <FiRefreshCw />, color: 'bg-yellow-600' }
    ];

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={CommentValidationSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting, values, setFieldValue }) => (
                <Form className="space-y-3">
                    <div>
                        <Field
                            as="textarea"
                            name="commentText"
                            rows={3}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Escriba su comentario (mínimo 10 caracteres)..."
                        />
                        <ErrorMessage
                            name="commentText"
                            component="div"
                            className="mt-1 text-xs text-red-600"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-gray-700">Votación:</span>
                            {voteOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => setFieldValue('voteStatus', option.value)}
                                    className={`
                                        w-8 h-8 rounded-full flex items-center justify-center transition-all
                                        ${values.voteStatus === option.value 
                                            ? `${option.color} text-white scale-110` 
                                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                        }
                                    `}
                                    title={option.label}
                                >
                                    {option.icon}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-2">
                            {onCancel && (
                                <button
                                    type="button"
                                    onClick={onCancel}
                                    className="px-3 py-1 text-xs text-gray-600 hover:bg-gray-200 rounded"
                                >
                                    Cancelar
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={isSubmitting || viewModel.loading}
                                className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                            >
                                {isSubmitting ? "Guardando..." : "Guardar"}
                            </button>
                        </div>
                    </div>

                    <ErrorMessage
                        name="voteStatus"
                        component="div"
                        className="text-xs text-red-600"
                    />

                    {viewModel.error && (
                        <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                            {viewModel.error}
                        </div>
                    )}
                </Form>
            )}
        </Formik>
    );
});

export default InlineCommentForm;