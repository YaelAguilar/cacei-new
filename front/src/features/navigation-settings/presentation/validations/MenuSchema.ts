import * as Yup from 'yup';

export const MenuValidationSchema = Yup.object().shape({
    name: Yup.string()
        .required('El nombre es obligatorio'),

    description: Yup.string()
        .required('La descripción es obligatoria')
        .max(35, 'La descripción no puede tener más de 35 caracteres'),

    icon: Yup.string()
        .required('El icono es obligatorio'),
        
    path: Yup.string()
        .required('El path es obligatorio'),
        
    order: Yup.string()
        .required('El orden es obligatorio'),
        
    feature_name: Yup.string()
        .required('El agrupador es obligatorio')
        .test(
            'no-leading-trailing-spaces',
            'El agrupador no puede tener espacios al inicio o al final',
            (value) => {
                if (!value) return true;
                return value === value.trim();
            }
        )
        .max(35, 'El agrupador no puede tener más de 35 caracteres')
        .matches(
            /^[a-z]+(-[a-z]+)*$/,
            'El agrupador debe estar en kebab-case (solo letras minúsculas separadas por guiones, ej: mi-feature)'
        )
        .test(
            'no-consecutive-hyphens',
            'El agrupador no puede tener guiones consecutivos',
            (value) => value ? !/-{2,}/.test(value) : true
        )
        .test(
            'no-start-end-hyphen',
            'El agrupador no puede empezar o terminar con guión',
            (value) => value ? !/^-|-$/.test(value) : true
        ),
    is_navegable: Yup.boolean()
        .required('Debe indicar si es navegable o no')
        .default(false)
        .oneOf([true, false], 'Debe ser verdadero o falso'),

    component_name: Yup.string()
        .nullable()
        .when('is_navegable', {
            is: true,
            then: (schema) => schema
                .required('El nombre de la vista es obligatorio cuando es navegable')
                .min(1, 'El nombre de la vista no puede estar vacío')
                .matches(
                    /^[A-Z][a-zA-Z0-9]*$/,
                    'El nombre de la vista debe estar en PascalCase (empezar con mayúscula)'
                ),
            otherwise: (schema) => schema
                .nullable()
                .transform((value) => value === '' ? null : value) // Convertir string vacío a null
        })
});