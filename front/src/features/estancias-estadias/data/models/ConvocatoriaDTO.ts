export interface CreateConvocatoriaRequest {
  nombre: string;
  descripcion?: string | null;
  fechaLimite: string; // ISO 8601 format
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
  fechaLimite: string;
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