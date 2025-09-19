// src/features/propuestas-comentarios/presentation/components/EditCommentForm.tsx
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { observer } from "mobx-react-lite";
import { CommentsViewModel } from "../viewModels/CommentsViewModel";
import { CommentValidationSchema } from "../validations/CommentSchema";
import Button from "../../../shared/components/Button";
import { FiMessageSquare, FiCheckCircle, FiXCircle, FiRefreshCw } from "react-icons/fi";

interface EditCommentFormProps {
    viewModel: CommentsViewModel;
    onSuccess?: () => void;
    onCancel?: () => void;
}

const EditCommentForm: React.FC<EditCommentFormProps> = observer(({ 
    viewModel,
    onSuccess,
    onCancel 
}) => {
    const comment = viewModel.selectedComment;

    if (!comment) return null;

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
        { value: 'ACEPTADO', label: 'Aceptado', icon: <FiCheckCircle />, color: 'text-green-600' },
        { value: 'RECHAZADO', label: 'Rechazado', icon: <FiXCircle />, color: 'text-red-600' },
        { value: 'ACTUALIZA', label: 'Requiere Actualización', icon: <FiRefreshCw />, color: 'text-yellow-600' }
    ];

    return (
        <div className="p-4">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Editar Comentario</h3>
                <p className="text-sm text-gray-600">
                    {comment.getSectionName()} › {comment.getSubsectionName()}
                </p>
            </div>

            <Formik
                initialValues={initialValues}
                validationSchema={CommentValidationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, isValid, values, setFieldValue }) => (
                    <Form className="space-y-4">
                        {/* Comentario */}
                        <div>
                            <label 
                                htmlFor="commentText" 
                                className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
                            >
                                <FiMessageSquare className="w-4 h-4" />
                                Comentario
                            </label>
                            <Field
                                as="textarea"
                                name="commentText"
                                id="commentText"
                                rows={4}
                                className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <ErrorMessage
                                name="commentText"
                                component="div"
                                className="mt-1 text-sm text-red-600"
                            />
                        </div>

                        {/* Votación */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Votación
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {voteOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => setFieldValue('voteStatus', option.value)}
                                        className={`
                                            flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all
                                            ${values.voteStatus === option.value 
                                                ? `border-current ${option.color} bg-opacity-10` 
                                                : 'border-gray-300 hover:border-gray-400'
                                            }
                                        `}
                                    >
                                        <span className={values.voteStatus === option.value ? option.color : 'text-gray-600'}>
                                            {option.icon}
                                        </span>
                                        <span className={`font-medium ${values.voteStatus === option.value ? option.color : 'text-gray-700'}`}>
                                            {option.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="flex justify-end gap-3 pt-4 border-t">
                            {onCancel && (
                                <Button
                                    type="button"
                                    onClick={onCancel}
                                    isAdd={false}
                                    label="Cancelar"
                                />
                            )}
                            <Button
                                type="submit"
                                disabled={isSubmitting || !isValid || viewModel.loading}
                                isAdd={true}
                                label={
                                    isSubmitting || viewModel.loading
                                        ? "Guardando..."
                                        : "Actualizar Comentario"
                                }
                            />
                        </div>

                        {/* Error */}
                        {viewModel.error && (
                            <div className="p-3 mt-3 text-sm text-red-700 bg-red-100 border border-red-200 rounded-md">
                                {viewModel.error}
                            </div>
                        )}
                    </Form>
                )}
            </Formik>
        </div>
    );
});

export default EditCommentForm;