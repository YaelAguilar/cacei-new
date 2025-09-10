// src/features/alumnos-propuestas/presentation/validations/PropuestaSchema.ts
import * as Yup from 'yup';

// Helper para obtener fecha mínima (hoy)
const getMinDate = (): Date => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

// Validación para Step 1: Información del Alumno
export const Step1ValidationSchema = Yup.object().shape({
  tutorAcademicoId: Yup.number()
    .required('Debe seleccionar un tutor académico')
    .positive('Debe seleccionar un tutor académico válido'),
  
  tipoPasantia: Yup.string()
    .required('Debe seleccionar un tipo de pasantía')
    .oneOf(['Estancia I', 'Estancia II', 'Estadía', 'Estadía 1', 'Estadía 2'], 'Tipo de pasantía inválido')
});

// Validación para Step 2: Información del Proyecto
export const Step2ValidationSchema = Yup.object().shape({
  nombreProyecto: Yup.string()
    .required('El nombre del proyecto es obligatorio')
    .trim()
    .min(5, 'El nombre debe tener al menos 5 caracteres')
    .max(255, 'El nombre no puede exceder 255 caracteres'),
  
  descripcionProyecto: Yup.string()
    .required('La descripción del proyecto es obligatoria')
    .trim()
    .min(20, 'La descripción debe tener al menos 20 caracteres')
    .max(1000, 'La descripción no puede exceder 1000 caracteres'),
  
  entregables: Yup.string()
    .required('Los entregables son obligatorios')
    .trim()
    .min(10, 'Los entregables deben tener al menos 10 caracteres')
    .max(500, 'Los entregables no pueden exceder 500 caracteres'),
  
  tecnologias: Yup.string()
    .required('Las tecnologías son obligatorias')
    .trim()
    .min(5, 'Las tecnologías deben tener al menos 5 caracteres')
    .max(300, 'Las tecnologías no pueden exceder 300 caracteres'),
  
  supervisorProyecto: Yup.string()
    .required('El supervisor del proyecto es obligatorio')
    .trim()
    .min(2, 'El nombre del supervisor debe tener al menos 2 caracteres')
    .max(255, 'El nombre del supervisor no puede exceder 255 caracteres'),
  
  actividades: Yup.string()
    .required('Las actividades son obligatorias')
    .trim()
    .min(20, 'Las actividades deben tener al menos 20 caracteres')
    .max(1000, 'Las actividades no pueden exceder 1000 caracteres'),
  
  fechaInicio: Yup.date()
    .required('La fecha de inicio es obligatoria')
    .min(getMinDate(), 'La fecha de inicio no puede ser anterior a hoy'),
  
  fechaFin: Yup.date()
    .required('La fecha de fin es obligatoria')
    .min(Yup.ref('fechaInicio'), 'La fecha de fin debe ser posterior a la fecha de inicio')
});

// Validación para Step 3: Información de la Empresa
export const Step3ValidationSchema = Yup.object().shape({
  nombreEmpresa: Yup.string()
    .required('El nombre de la empresa es obligatorio')
    .trim()
    .min(2, 'El nombre de la empresa debe tener al menos 2 caracteres')
    .max(255, 'El nombre de la empresa no puede exceder 255 caracteres'),
  
  sectorEmpresa: Yup.string()
    .required('El sector de la empresa es obligatorio')
    .trim()
    .min(2, 'El sector debe tener al menos 2 caracteres')
    .max(100, 'El sector no puede exceder 100 caracteres'),
  
  personaContacto: Yup.string()
    .required('La persona de contacto es obligatoria')
    .trim()
    .min(2, 'El nombre de la persona de contacto debe tener al menos 2 caracteres')
    .max(255, 'El nombre de la persona de contacto no puede exceder 255 caracteres'),
  
  paginaWebEmpresa: Yup.string()
    .nullable()
    .url('Debe ser una URL válida (incluir http:// o https://)')
    .max(255, 'La URL no puede exceder 255 caracteres')
    .transform((value) => value === '' ? null : value)
});

// Validación completa del formulario
export const PropuestaCompleteValidationSchema = Yup.object().shape({
  ...Step1ValidationSchema.fields,
  ...Step2ValidationSchema.fields,
  ...Step3ValidationSchema.fields
});

// Validaciones en tiempo real
export const PropuestaRealTimeValidation = {
  validateStep1: (values: any): boolean => {
    try {
      Step1ValidationSchema.validateSync(values, { abortEarly: false });
      return true;
    } catch {
      return false;
    }
  },

  validateStep2: (values: any): boolean => {
    try {
      Step2ValidationSchema.validateSync(values, { abortEarly: false });
      return true;
    } catch {
      return false;
    }
  },

  validateStep3: (values: any): boolean => {
    try {
      Step3ValidationSchema.validateSync(values, { abortEarly: false });
      return true;
    } catch {
      return false;
    }
  },

  validateComplete: (values: any): boolean => {
    try {
      PropuestaCompleteValidationSchema.validateSync(values, { abortEarly: false });
      return true;
    } catch {
      return false;
    }
  }
};