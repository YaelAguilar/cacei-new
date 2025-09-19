// src/features/propuestas-comentarios/presentation/components/InlineCommentEditForm.tsx
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { observer } from "mobx-react-lite";
import { CommentsViewModel } from "../viewModels/CommentsViewModel";
import { ProposalComment } from "../../data/models/ProposalComment";
import { CommentValidationSchema } from "../validations/CommentSchema";
import { FiCheckCircle, FiXCircle, FiRefreshCw } from "react-icons/fi";

interface InlineCommentEditFormProps {
    comment: ProposalComment;
    viewModel: CommentsViewModel;
    onSuccess?: () => void;
    onCancel?: () => void;
}

const InlineCommentEditForm: React.FC<InlineCommentEditFormProps> = observer(({ 
    comment,
    viewModel,
    onSuccess,
    onCancel 
}) => {
    const initialValues = {
        commentText: comment.getCommentText(),
        voteStatus: comment.getVoteStatus()
    };

    const handleSubmit = async (values: any) => {
        const success = await viewModel.updateComment(comment.getId(), {
            commentText: values.commentText,
            voteStatus: values.voteStatus
        });

        if (success && onSuccess) {
            onSuccess();
        }
    };

    const voteOptions = [
        { value: 'ACEPTADO', icon: <FiCheckCircle />, color: 'bg-green-600' },
        { value: 'RECHAZADO', icon: <FiXCircle />, color: 'bg-red-600' },
        { value: 'ACTUALIZA', icon: <FiRefreshCw />, color: 'bg-yellow-600' }
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
                                disabled={isSubmitting}
                                className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Actualizar
                            </button>
                        </div>
                    </div>

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

export default InlineCommentEditForm;