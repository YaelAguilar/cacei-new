// front/src/features/alumnos-propuestas/data/models/PropuestaDTO.ts

export interface CreatePropuestaRequest {
  academicTutorId: number;
  internshipType: string;
  
  // Información de la empresa
  companyShortName?: string | null;
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
  nombreCorto?: string | null;
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

// Nuevo DTO que refleja la estructura del backend actualizado
export interface PropuestaCompletaResponseAttributes {
  // Estatus de la propuesta (nuevo campo del backend)
  estatus?: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO' | 'ACTUALIZAR';
  
  // Información del alumno (sección)
  informacionDelAlumno?: {
    tutorAcademico: TutorAcademicoDTO;
    pasantiaARealizar: string;
  };
  
  // Información de la empresa (sección)
  informacionDeLaEmpresa?: {
    nombreCorto?: string | null;
    nombreLegal: string;
    rfc: string;
  };
  
  // Dirección física y en la web de la empresa (sección)
  direccionFisicaYEnLaWebDeLaEmpresa?: {
    entidadFederativa: string;
    demarcacionTerritorial: string;
    tipoDeAsentamientoHumano: string;
    nombreDelAsentamientoHumano: string;
    vialidad: string;
    nombreDeLaVia: string;
    numeroExterior: string;
    numeroInterior?: string | null;
    codigoPostal: string;
    paginaWeb?: string | null;
    linkedin?: string | null;
  };
  
  // Información de contacto en la empresa (sección)
  informacionDeContactoEnLaEmpresa?: {
    nombreDeLaPersonaDeContacto: string;
    puestoEnLaEmpresaDeLaPersonaDeContacto: string;
    direccionElectronicaDeCorreo: string;
    numeroTelefonico: string;
    nombreDelAreaAsociada: string;
  };
  
  // Supervisor del proyecto de estancia o estadía (sección)
  supervisorDelProyectoDeEstanciaOEstadia?: {
    nombreDelSupervisor: string;
    areaDeLaEmpresaEnLaQueSeDesarrollaraElProyecto: string;
    direccionElectronicaDeCorreo: string;
    numeroDeTelefono: string;
  };
  
  // Datos del proyecto (sección)
  datosDelProyecto?: {
    nombreDelProyecto: string;
    fechaDeInicioDelProyecto: string;
    fechaDeCierreDelProyecto: string;
    contextoDeLaProblematica: string;
    problematica: string;
    objetivoGeneralDelProyectoADesarrollar: string;
    objetivosEspecificosDelProyecto: string;
    principalesActividadesARealizarEnLaEstanciaOEstadia: string;
    entregablesPlaneadosDelProyecto: string;
    tecnologiasAAplicarEnElProyecto: string;
  };
  
  // Campos de compatibilidad con la estructura anterior
  idConvocatoria?: number;
  tutorAcademico?: TutorAcademicoDTO;
  tipoPasantia?: string;
  empresa?: EmpresaCompletaDTO;
  contacto?: ContactoDTO;
  supervisor?: SupervisorDTO;
  proyecto?: ProyectoCompletoDTO;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
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
  companyShortName?: string | null;
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

// Nuevo DTO para actualizar estatus de propuesta
export interface UpdateProposalStatusRequest {
  status: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO' | 'ACTUALIZAR';
}