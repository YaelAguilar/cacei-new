// src/features/propuestas-comentarios/presentation/validations/CommentSchema.ts
import * as Yup from 'yup';

export const CommentValidationSchema = Yup.object().shape({
    commentText: Yup.string()
        .required('El comentario es obligatorio')
        .min(10, 'El comentario debe tener al menos 10 caracteres')
        .max(1000, 'El comentario no puede exceder 1000 caracteres'),
    
    voteStatus: Yup.string()
        .required('Debe seleccionar una votación')
        .oneOf(['ACEPTADO', 'RECHAZADO', 'ACTUALIZA'], 'Votación inválida')
});

// ✅ NUEVO: Schema específico para editar comentarios (solo permite ACTUALIZA)
export const EditCommentValidationSchema = Yup.object().shape({
    commentText: Yup.string()
        .required('El comentario es obligatorio')
        .min(10, 'El comentario debe tener al menos 10 caracteres')
        .max(1000, 'El comentario no puede exceder 1000 caracteres'),
    
    voteStatus: Yup.string()
        .oneOf(['ACTUALIZA'], 'Solo se pueden editar comentarios con estado ACTUALIZA')
        .optional()
});