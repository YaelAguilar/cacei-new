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
  academicTutorId: Yup.number()
    .required('Debe seleccionar un tutor académico')
    .positive('Debe seleccionar un tutor académico válido'),
  
  internshipType: Yup.string()
    .required('Debe seleccionar un tipo de pasantía')
    .oneOf(['Estancia I', 'Estancia II', 'Estadía', 'Estadía 1', 'Estadía 2'], 'Tipo de pasantía inválido')
});

// Validación para Step 2: Información de la Empresa
export const Step2ValidationSchema = Yup.object().shape({
  // Información básica de la empresa
  companyShortName: Yup.string()
    .required('El nombre comercial de la empresa es obligatorio')
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(255, 'El nombre no puede exceder 255 caracteres'),
  
  companyLegalName: Yup.string()
    .required('La razón social es obligatoria')
    .trim()
    .min(2, 'La razón social debe tener al menos 2 caracteres')
    .max(255, 'La razón social no puede exceder 255 caracteres'),
  
  companyTaxId: Yup.string()
    .required('El RFC es obligatorio')
    .trim()
    .min(12, 'El RFC debe tener al menos 12 caracteres')
    .max(13, 'El RFC no puede exceder 13 caracteres'),

  // Dirección
  companyState: Yup.string()
    .required('La entidad federativa es obligatoria')
    .trim()
    .min(2, 'Debe tener al menos 2 caracteres'),
  
  companyMunicipality: Yup.string()
    .required('La demarcación territorial es obligatoria')
    .trim()
    .min(2, 'Debe tener al menos 2 caracteres'),
  
  companySettlementType: Yup.string()
    .required('El tipo de asentamiento es obligatorio')
    .oneOf(['Colonia', 'Fraccionamiento', 'Barrio', 'Centro', 'Zona Industrial'], 'Tipo de asentamiento inválido'),
  
  companySettlementName: Yup.string()
    .required('El nombre del asentamiento es obligatorio')
    .trim()
    .min(2, 'Debe tener al menos 2 caracteres'),
  
  companyStreetType: Yup.string()
    .required('El tipo de vialidad es obligatorio')
    .oneOf(['Calle', 'Avenida', 'Boulevard', 'Carretera', 'Privada'], 'Tipo de vialidad inválido'),
  
  companyStreetName: Yup.string()
    .required('El nombre de la vía es obligatorio')
    .trim()
    .min(2, 'Debe tener al menos 2 caracteres'),
  
  companyExteriorNumber: Yup.string()
    .required('El número exterior es obligatorio')
    .trim()
    .min(1, 'Debe especificar el número exterior'),
  
  companyInteriorNumber: Yup.string()
    .nullable()
    .transform((value) => value === '' ? null : value),
  
  companyPostalCode: Yup.string()
    .required('El código postal es obligatorio')
    .matches(/^\d{5}$/, 'El código postal debe tener 5 dígitos'),

  // Enlaces web (opcionales)
  companyWebsite: Yup.string()
    .nullable()
    .url('Debe ser una URL válida (incluir http:// o https://)')
    .transform((value) => value === '' ? null : value),
  
  companyLinkedin: Yup.string()
    .nullable()
    .url('Debe ser una URL válida (incluir http:// o https://)')
    .transform((value) => value === '' ? null : value),

  // Información de contacto
  contactName: Yup.string()
    .required('El nombre de la persona de contacto es obligatorio')
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(255, 'El nombre no puede exceder 255 caracteres'),
  
  contactPosition: Yup.string()
    .required('El puesto es obligatorio')
    .trim()
    .min(2, 'El puesto debe tener al menos 2 caracteres')
    .max(255, 'El puesto no puede exceder 255 caracteres'),
  
  contactEmail: Yup.string()
    .required('El email es obligatorio')
    .email('Debe ser un email válido')
    .max(255, 'El email no puede exceder 255 caracteres'),
  
  contactPhone: Yup.string()
    .required('El teléfono es obligatorio')
    .trim()
    .min(10, 'El teléfono debe tener al menos 10 dígitos'),
  
  contactArea: Yup.string()
    .required('El área/departamento es obligatorio')
    .trim()
    .min(2, 'El área debe tener al menos 2 caracteres')
    .max(255, 'El área no puede exceder 255 caracteres')
});

// Validación para Step 3: Supervisor del Proyecto
export const Step3ValidationSchema = Yup.object().shape({
  supervisorName: Yup.string()
    .required('El nombre del supervisor es obligatorio')
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(255, 'El nombre no puede exceder 255 caracteres'),
  
  supervisorArea: Yup.string()
    .required('El área del supervisor es obligatoria')
    .trim()
    .min(2, 'El área debe tener al menos 2 caracteres')
    .max(255, 'El área no puede exceder 255 caracteres'),
  
  supervisorEmail: Yup.string()
    .required('El email del supervisor es obligatorio')
    .email('Debe ser un email válido')
    .max(255, 'El email no puede exceder 255 caracteres'),
  
  supervisorPhone: Yup.string()
    .required('El teléfono del supervisor es obligatorio')
    .trim()
    .min(10, 'El teléfono debe tener al menos 10 dígitos')
});

// Validación para Step 4: Información del Proyecto
export const Step4ValidationSchema = Yup.object().shape({
  projectName: Yup.string()
    .required('El nombre del proyecto es obligatorio')
    .trim()
    .min(5, 'El nombre debe tener al menos 5 caracteres')
    .max(255, 'El nombre no puede exceder 255 caracteres'),
  
  projectStartDate: Yup.date()
    .required('La fecha de inicio es obligatoria')
    .min(getMinDate(), 'La fecha de inicio no puede ser anterior a hoy'),
  
  projectEndDate: Yup.date()
    .required('La fecha de fin es obligatoria')
    .min(Yup.ref('projectStartDate'), 'La fecha de fin debe ser posterior a la fecha de inicio'),
  
  projectProblemContext: Yup.string()
    .required('El contexto de la problemática es obligatorio')
    .trim()
    .min(50, 'El contexto debe tener al menos 50 caracteres')
    .max(2000, 'El contexto no puede exceder 2000 caracteres'),
  
  projectProblemDescription: Yup.string()
    .required('La descripción de la problemática es obligatoria')
    .trim()
    .min(50, 'La descripción debe tener al menos 50 caracteres')
    .max(2000, 'La descripción no puede exceder 2000 caracteres'),
  
  projectGeneralObjective: Yup.string()
    .required('El objetivo general es obligatorio')
    .trim()
    .min(20, 'El objetivo general debe tener al menos 20 caracteres')
    .max(1000, 'El objetivo general no puede exceder 1000 caracteres'),
  
  projectSpecificObjectives: Yup.string()
    .required('Los objetivos específicos son obligatorios')
    .trim()
    .min(50, 'Los objetivos específicos deben tener al menos 50 caracteres')
    .max(2000, 'Los objetivos específicos no pueden exceder 2000 caracteres'),
  
  projectMainActivities: Yup.string()
    .required('Las actividades principales son obligatorias')
    .trim()
    .min(50, 'Las actividades deben tener al menos 50 caracteres')
    .max(2000, 'Las actividades no pueden exceder 2000 caracteres'),
  
  projectPlannedDeliverables: Yup.string()
    .required('Los entregables planeados son obligatorios')
    .trim()
    .min(20, 'Los entregables deben tener al menos 20 caracteres')
    .max(1000, 'Los entregables no pueden exceder 1000 caracteres'),
  
  projectTechnologies: Yup.string()
    .required('Las tecnologías son obligatorias')
    .trim()
    .min(5, 'Las tecnologías deben tener al menos 5 caracteres')
    .max(500, 'Las tecnologías no pueden exceder 500 caracteres')
});

// Validación completa del formulario
export const PropuestaCompleteValidationSchema = Yup.object().shape({
  ...Step1ValidationSchema.fields,
  ...Step2ValidationSchema.fields,
  ...Step3ValidationSchema.fields,
  ...Step4ValidationSchema.fields
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

  validateStep4: (values: any): boolean => {
    try {
      Step4ValidationSchema.validateSync(values, { abortEarly: false });
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