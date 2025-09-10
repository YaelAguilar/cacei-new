// src/features/alumnos-propuestas/data/models/PropuestaDTO.ts

export interface CreatePropuestaRequest {
  tutorAcademicoId: number;
  tipoPasantia: string;
  nombreProyecto: string;
  descripcionProyecto: string;
  entregables: string;
  tecnologias: string;
  supervisorProyecto: string;
  actividades: string;
  fechaInicio: string; // ISO format
  fechaFin: string; // ISO format
  nombreEmpresa: string;
  sectorEmpresa: string;
  personaContacto: string;
  paginaWebEmpresa?: string | null;
}

export interface TutorAcademicoDTO {
  id: number;
  nombre: string;
  email: string;
}

export interface ProyectoDTO {
  nombre: string;
  descripcion: string;
  entregables: string;
  tecnologias: string;
  supervisor: string;
  actividades: string;
  fechaInicio: string;
  fechaFin: string;
}

export interface EmpresaDTO {
  nombre: string;
  sector: string;
  personaContacto: string;
  paginaWeb?: string | null;
}

export interface PropuestaResponseAttributes {
  idConvocatoria: number;
  tutorAcademico: TutorAcademicoDTO;
  tipoPasantia: string;
  proyecto: ProyectoDTO;
  empresa: EmpresaDTO;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PropuestaResponseDTO {
  type: string;
  id: string;
  attributes: PropuestaResponseAttributes;
}

export interface JsonApiPropuestaResponse {
  data: PropuestaResponseDTO;
}

export interface JsonApiPropuestasListResponse {
  data: PropuestaResponseDTO[];
}

export interface ConvocatoriaActivaAttributes {
  nombre: string;
  pasantiasDisponibles: string[];
  profesoresDisponibles: TutorAcademicoDTO[];
}

export interface ConvocatoriaActivaDTO {
  type: string;
  id: string;
  attributes: ConvocatoriaActivaAttributes;
}

export interface JsonApiConvocatoriaActivaResponse {
  data: ConvocatoriaActivaDTO;
}

export interface ApiErrorDetail {
  status: string;
  title: string;
  detail: string;
}

export interface ErrorResponse {
  errors: ApiErrorDetail[];
}

export interface UpdatePropuestaRequest {
  tutorAcademicoId?: number;
  tipoPasantia?: string;
  nombreProyecto?: string;
  descripcionProyecto?: string;
  entregables?: string;
  tecnologias?: string;
  supervisorProyecto?: string;
  actividades?: string;
  fechaInicio?: string;
  fechaFin?: string;
  nombreEmpresa?: string;
  sectorEmpresa?: string;
  personaContacto?: string;
  paginaWebEmpresa?: string | null;
}