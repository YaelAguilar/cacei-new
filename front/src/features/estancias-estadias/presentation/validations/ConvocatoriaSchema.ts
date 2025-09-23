// src/features/estancias-estadias/presentation/validations/ConvocatoriaSchema.ts

import * as Yup from 'yup';

// 🚀 MODIFICADO: Helper para obtener fecha mínima (mañana)
const getMinDate = (): Date => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1); // Mínimo mañana
  return tomorrow;
};

// Opciones válidas de pasantías
const OPCIONES_PASANTIAS_VALIDAS = ["Estancia I", "Estancia II", "Estadía", "Estadía 1", "Estadía 2"] as const;

export const ConvocatoriaValidationSchema = Yup.object().shape({
  nombre: Yup.string()
    .required('El nombre es obligatorio')
    .trim()
    .min(1, 'El nombre no puede estar vacío'),
  
  descripcion: Yup.string()
    .nullable()
    .notRequired(),
  
  // 🚀 MODIFICADO: Validación para input type="date" (solo fecha)
  fechaLimite: Yup.string()
    .required('La fecha límite es obligatoria')
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'La fecha debe tener el formato YYYY-MM-DD')
    .test('future-date', 'La fecha límite debe ser al menos mañana', function(value: string | undefined) {
      if (!value) return false;
      
      // Parsear la fecha seleccionada (solo fecha, sin hora)
      const selectedDate = new Date(value + 'T00:00:00.000Z');
      const minDate = getMinDate();
      
      // Comparar solo las fechas (sin hora)
      const selectedDateOnly = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
      const minDateOnly = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
      
      return selectedDateOnly >= minDateOnly;
    }),
  
  pasantiasSeleccionadas: Yup.array()
    .of(Yup.string().required())
    .min(1, 'Debe seleccionar al menos una pasantía')
    .max(5, 'No se pueden seleccionar más de 5 pasantías')
    .test('valid-pasantias', 'Pasantías inválidas seleccionadas', function(value: string[] | undefined) {
      if (!value || !Array.isArray(value)) return false;
      
      return value.every((pasantia: string) => {
        return typeof pasantia === 'string' && OPCIONES_PASANTIAS_VALIDAS.includes(pasantia as any);
      });
    })
    .required('Debe seleccionar al menos una pasantía')
});

// 🚀 MODIFICADO: Schema específico para validaciones en tiempo real
export const ConvocatoriaRealTimeValidation = {
  validateNombre: (nombre: string): string | null => {
    if (!nombre || nombre.trim() === "") {
      return "El nombre es obligatorio";
    }
    return null;
  },

  // 🚀 MODIFICADO: Validar fecha en formato YYYY-MM-DD
  validateFechaLimite: (fechaLimite: string): string | null => {
    if (!fechaLimite) {
      return "La fecha límite es obligatoria";
    }

    // Validar formato
    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaRegex.test(fechaLimite)) {
      return "La fecha debe tener el formato YYYY-MM-DD";
    }

    // Validar que sea una fecha válida
    const selectedDate = new Date(fechaLimite + 'T00:00:00.000Z');
    if (isNaN(selectedDate.getTime())) {
      return "Fecha inválida";
    }

    // Validar que sea al menos mañana
    const minDate = getMinDate();
    const selectedDateOnly = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    const minDateOnly = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());

    if (selectedDateOnly < minDateOnly) {
      return "La fecha límite debe ser al menos mañana";
    }

    return null;
  },

  validatePasantias: (pasantias: string[]): string | null => {
    if (!pasantias || pasantias.length === 0) {
      return "Debe seleccionar al menos una pasantía";
    }

    if (pasantias.length > 5) {
      return "No se pueden seleccionar más de 5 pasantías";
    }

    // Verificar que todas las pasantías sean válidas
    const pasantiasInvalidas: string[] = [];
    
    for (const pasantia of pasantias) {
      if (typeof pasantia === 'string' && !OPCIONES_PASANTIAS_VALIDAS.includes(pasantia as any)) {
        pasantiasInvalidas.push(pasantia);
      }
    }

    if (pasantiasInvalidas.length > 0) {
      return `Pasantías inválidas: ${pasantiasInvalidas.join(", ")}`;
    }

    return null;
  }
};