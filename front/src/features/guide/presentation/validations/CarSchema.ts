import * as Yup from 'yup';

// Esquema de validación para el formulario de carros
export const CarValidationSchema = Yup.object().shape({
  make: Yup.string()
    .required('La marca es obligatoria')
    .min(2, 'La marca debe tener al menos 2 caracteres')
    .max(50, 'La marca no puede tener más de 50 caracteres'),
  
  model: Yup.string()
    .required('El modelo es obligatorio')
    .min(1, 'El modelo debe tener al menos 1 carácter')
    .max(50, 'El modelo no puede tener más de 50 caracteres'),
  
  year: Yup.number()
    .required('El año es obligatorio')
    .min(1900, 'El año no puede ser anterior a 1900')
    .max(new Date().getFullYear() + 1, `El año no puede ser posterior a ${new Date().getFullYear() + 1}`)
    .integer('El año debe ser un número entero'),
  
  color: Yup.string()
    .max(30, 'El color no puede tener más de 30 caracteres'),
  
  licensePlate: Yup.string()
    .max(20, 'La placa no puede tener más de 20 caracteres')
    .matches(/^[A-Za-z0-9-\s]*$/, 'La placa solo puede contener letras, números, guiones y espacios')
});

// Si necesitas otras validaciones relacionadas, puedes añadirlas aquí
// Por ejemplo, un esquema más simplificado para búsquedas:
export const CarSearchSchema = Yup.object().shape({
  term: Yup.string()
    .min(2, 'El término de búsqueda debe tener al menos 2 caracteres')
});