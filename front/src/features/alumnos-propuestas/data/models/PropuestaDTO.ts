// src/features/alumnos-propuestas/data/models/PropuestaDTO.ts

export interface CreatePropuestaRequest {
  academicTutorId: number;
  internshipType: string;
  
  // Información de la empresa
  companyShortName: string;
  companyLegalName: string;
  companyTaxId: string;
  
  // Dirección de la empresa
  companyState: string;
  companyMunicipality: string;
  companySettlementType: string;
  companySettlementName: string;
  companyStreetType: string;
  companyStreetName: string;
  companyExteriorNumber: string;
  companyInteriorNumber?: string | null;
  companyPostalCode: string;
  companyWebsite?: string | null;
  companyLinkedin?: string | null;
  
  // Información de contacto
  contactName: string;
  contactPosition: string;
  contactEmail: string;
  contactPhone: string;
  contactArea: string;
  
  // Supervisor del proyecto
  supervisorName: string;
  supervisorArea: string;
  supervisorEmail: string;
  supervisorPhone: string;
  
  // Datos del proyecto
  projectName: string;
  projectStartDate: string; // ISO format
  projectEndDate: string; // ISO format
  projectProblemContext: string;
  projectProblemDescription: string;
  projectGeneralObjective: string;
  projectSpecificObjectives: string;
  projectMainActivities: string;
  projectPlannedDeliverables: string;
  projectTechnologies: string;
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
  academicTutorId?: number;
  internshipType?: string;
  
  // Información de la empresa
  companyShortName?: string;
  companyLegalName?: string;
  companyTaxId?: string;
  
  // Dirección de la empresa
  companyState?: string;
  companyMunicipality?: string;
  companySettlementType?: string;
  companySettlementName?: string;
  companyStreetType?: string;
  companyStreetName?: string;
  companyExteriorNumber?: string;
  companyInteriorNumber?: string | null;
  companyPostalCode?: string;
  companyWebsite?: string | null;
  companyLinkedin?: string | null;
  
  // Información de contacto
  contactName?: string;
  contactPosition?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactArea?: string;
  
  // Supervisor del proyecto
  supervisorName?: string;
  supervisorArea?: string;
  supervisorEmail?: string;
  supervisorPhone?: string;
  
  // Datos del proyecto
  projectName?: string;
  projectStartDate?: string;
  projectEndDate?: string;
  projectProblemContext?: string;
  projectProblemDescription?: string;
  projectGeneralObjective?: string;
  projectSpecificObjectives?: string;
  projectMainActivities?: string;
  projectPlannedDeliverables?: string;
  projectTechnologies?: string;
}