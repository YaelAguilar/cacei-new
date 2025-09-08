import * as Yup from 'yup';

export const SubmenuValidationSchema = Yup.object().shape({
    menuId: Yup.string().required('El menú es requerido'),
    name: Yup.string().required('El nombre es requerido'),
    description: Yup.string().required('La descripción es requerida'),
    component_name: Yup.string()
        .required('El nombre de la vista es obligatorio.')
        .min(1, 'El nombre de la vista no puede estar vacío')
        .matches(
            /^[A-Z][a-zA-Z0-9]*$/,
            'El nombre de la vista debe estar en PascalCase (empezar con mayúscula)'
        ),
    path: Yup.string().required('La ruta es requerida'),
    order: Yup.number().required('El orden es requerido').integer('Debe ser un número entero').min(1, 'Debe ser mayor a 0'),
});