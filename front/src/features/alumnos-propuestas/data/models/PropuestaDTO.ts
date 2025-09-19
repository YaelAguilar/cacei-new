// front/src/features/alumnos-propuestas/data/models/PropuestaDTO.ts

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
  projectStartDate: string;
  projectEndDate: string;
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

export interface DireccionEmpresaDTO {
  estado: string;
  municipio: string;
  tipoAsentamiento: string;
  nombreAsentamiento: string;
  tipoVialidad: string;
  nombreVia: string;
  numeroExterior: string;
  numeroInterior?: string | null;
  codigoPostal: string;
}

export interface EmpresaCompletaDTO {
  nombreCorto: string;
  razonSocial: string;
  rfc: string;
  direccion: DireccionEmpresaDTO;
  paginaWeb?: string | null;
  linkedin?: string | null;
  sector: string;
}

export interface ContactoDTO {
  nombre: string;
  puesto: string;
  email: string;
  telefono: string;
  area: string;
}

export interface SupervisorDTO {
  nombre: string;
  area: string;
  email: string;
  telefono: string;
}

export interface ProyectoCompletoDTO {
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  contextoProblema: string;
  descripcionProblema: string;
  objetivoGeneral: string;
  objetivosEspecificos: string;
  actividadesPrincipales: string;
  entregablesPlaneados: string;
  tecnologias: string;
}

export interface PropuestaCompletaResponseAttributes {
  idConvocatoria: number;
  tutorAcademico: TutorAcademicoDTO;
  tipoPasantia: string;
  empresa: EmpresaCompletaDTO;
  contacto: ContactoDTO;
  supervisor: SupervisorDTO;
  proyecto: ProyectoCompletoDTO;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PropuestaCompletaResponseDTO {
  type: string;
  id: string;
  attributes: PropuestaCompletaResponseAttributes;
}

export interface JsonApiPropuestaCompletaResponse {
  data: PropuestaCompletaResponseDTO;
}

export interface JsonApiPropuestasCompletasListResponse {
  data: PropuestaCompletaResponseDTO[];
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