// src/features/estancias-estadias/presentation/validations/ConvocatoriaSchema.ts

import * as Yup from 'yup';

// Helper para obtener fecha mínima (24 horas en el futuro)
const getMinDatetime = (): Date => {
  const now = new Date();
  return new Date(now.getTime() + 24 * 60 * 60 * 1000);
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
  
  fechaLimite: Yup.string()
    .required('La fecha límite es obligatoria')
    .test('future-date', 'La fecha límite debe ser al menos 24 horas en el futuro', function(value: string | undefined) {
      if (!value) return false;
      
      const selectedDate = new Date(value);
      const minDate = getMinDatetime();
      
      return selectedDate > minDate;
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

// Schema específico para validaciones en tiempo real
export const ConvocatoriaRealTimeValidation = {
  validateNombre: (nombre: string): string | null => {
    if (!nombre || nombre.trim() === "") {
      return "El nombre es obligatorio";
    }
    return null;
  },

  validateFechaLimite: (fechaLimite: string): string | null => {
    if (!fechaLimite) {
      return "La fecha límite es obligatoria";
    }

    const selectedDate = new Date(fechaLimite);
    const minDate = getMinDatetime();

    if (selectedDate <= minDate) {
      return "La fecha límite debe ser al menos 24 horas en el futuro";
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