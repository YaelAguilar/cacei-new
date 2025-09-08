import * as Yup from 'yup';

export const RoleValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required('El nombre es obligatorio'),
  
  description: Yup.string()
    .required('La descripción es obligatoria')
    .max(35, 'La descripción no puede tener más de 35 caracteres'),
  
});