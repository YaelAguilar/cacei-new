export interface CreateConvocatoriaRequest {
  nombre: string;
  descripcion?: string | null;
  fechaLimite: string; // 👈 CAMBIADO: Ahora es string con formato YYYY-MM-DD (será convertido en backend)
  pasantiasSeleccionadas: string[];
}

export interface ProfesorApiItem {
  type: string;
  id: number;
  attributes: {
    nombre: string;
    email: string;
  };
}

export interface ProfesoresApiResponse {
  data: ProfesorApiItem[];
}

export interface ConvocatoriaResponseAttributes {
  nombre: string;
  descripcion: string | null;
  fechaLimite: string; // Viene como ISO string desde el backend
  pasantiasDisponibles: string[];
  profesoresDisponibles: ProfesorDTO[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProfesorDTO {
  id: number;
  nombre: string;
  email: string;
}

export interface ConvocatoriaResponseDTO {
  type: string;
  id: string;
  attributes: ConvocatoriaResponseAttributes;
}

export interface JsonApiConvocatoriaResponse {
  data: ConvocatoriaResponseDTO;
}

// Nueva interface para la lista de convocatorias
export interface JsonApiConvocatoriasListResponse {
  data: ConvocatoriaResponseDTO[];
}

export interface ActiveConvocatoriaCheckAttributes {
  hasActiveConvocatoria: boolean;
}

export interface ActiveConvocatoriaCheckDTO {
  type: string;
  attributes: ActiveConvocatoriaCheckAttributes;
}

export interface JsonApiActiveConvocatoriaResponse {
  data: ActiveConvocatoriaCheckDTO;
}

export interface ApiErrorDetail {
  status: string;
  title: string;
  detail: string;
}

export interface ErrorResponse {
  errors: ApiErrorDetail[];
}

export interface UpdateConvocatoriaRequest {
  nombre?: string;
  descripcion?: string | null;
  fechaLimite?: string; // 👈 CAMBIADO: Ahora es string con formato YYYY-MM-DD (será convertido en backend)
  pasantiasSeleccionadas?: string[];
  actualizarProfesores?: boolean;
}