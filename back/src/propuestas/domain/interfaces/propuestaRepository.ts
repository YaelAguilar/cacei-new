// src/propuestas/domain/interfaces/propuestaRepository.ts
import { Propuesta, ProposalStatus } from "../models/propuesta";

export interface PropuestaCreateData {
    // Relaciones
    convocatoriaId: number;
    studentId: number;
    
    // INFORMACIÓN DEL ALUMNO (sección) - ACTUALIZADA
    studentName: string; // NUEVO: Nombre completo del estudiante
    studentEmail: string; // NUEVO: Email del estudiante
    academicTutorId: number; // tutor académico (subsección)
    academicTutorName: string;
    academicTutorEmail: string;
    internshipType: string; // Pasantía a realizar (subsección)
    
    // INFORMACIÓN DE LA EMPRESA (sección)
    companyShortName?: string | null; // Nombre corto (subsección) - OPCIONAL
    companyLegalName: string; // Nombre legal (subsección)
    companyTaxId: string; // RFC - Registro Federal de Contribuyentes (subsección)
    
    // DIRECCIÓN FÍSICA Y EN LA WEB DE LA EMPRESA (sección)
    companyState: string; // Entidad federativa (subsección)
    companyMunicipality: string; // Demarcación territorial (subsección)
    companySettlementType: string; // Tipo de asentamiento humano (subsección)
    companySettlementName: string; // Nombre del asentamiento humano (subsección)
    companyStreetType: string; // Vialidad (subsección)
    companyStreetName: string; // Nombre de la vía (subsección)
    companyExteriorNumber: string; // Número exterior (subsección)
    companyInteriorNumber?: string | null; // Número interior (subsección) - OPCIONAL
    companyPostalCode: string; // Código postal (subsección)
    companyWebsite?: string | null; // Página Web (subsección) - OPCIONAL
    companyLinkedin?: string | null; // LinkedIn (subsección) - OPCIONAL
    
    // INFORMACIÓN DE CONTACTO EN LA EMPRESA (sección)
    contactName: string; // Nombre de la persona de contacto (subsección)
    contactPosition: string; // Puesto en la empresa de la persona de contacto (subsección)
    contactEmail: string; // Dirección electrónica de correo (subsección)
    contactPhone: string; // Número telefónico (subsección)
    contactArea: string; // Nombre del área asociada (subsección)
    
    // SUPERVISOR DEL PROYECTO DE ESTANCIA O ESTADÍA (sección)
    supervisorName: string; // Nombre del Supervisor (subsección)
    supervisorArea: string; // Área de la empresa en la que se desarrollará el proyecto (subsección)
    supervisorEmail: string; // Dirección electrónica de correo (subsección)
    supervisorPhone: string; // Número de teléfono (subsección)
    
    // DATOS DEL PROYECTO (sección)
    projectName: string; // Nombre del proyecto (subsección)
    projectStartDate: Date; // Fecha de inicio del proyecto (subsección)
    projectEndDate: Date; // Fecha de cierre del proyecto (subsección)
    projectProblemContext: string; // Contexto de la problemática (subsección)
    projectProblemDescription: string; // Problemática (subsección)
    projectGeneralObjective: string; // Objetivo general del proyecto a desarrollar (subsección)
    projectSpecificObjectives: string; // Objetivos específicos del proyecto (subsección)
    projectMainActivities: string; // Principales actividades a realizar en la estancia o estadía (subsección)
    projectPlannedDeliverables: string; // Entregables planeados del proyecto (subsección)
    projectTechnologies: string; // Tecnologías a aplicar en el proyecto (subsección)
    
    // Control
    userCreation?: number | null;
}

export interface PropuestaUpdateData {
    // INFORMACIÓN DEL ALUMNO (sección) - No se actualiza nombre y email del estudiante
    academicTutorId?: number; // tutor académico (subsección)
    academicTutorName?: string;
    academicTutorEmail?: string;
    internshipType?: string; // Pasantía a realizar (subsección)
    
    // INFORMACIÓN DE LA EMPRESA (sección)
    companyShortName?: string | null; // Nombre corto (subsección)
    companyLegalName?: string; // Nombre legal (subsección)
    companyTaxId?: string; // RFC (subsección)
    
    // DIRECCIÓN FÍSICA Y EN LA WEB DE LA EMPRESA (sección)
    companyState?: string; // Entidad federativa (subsección)
    companyMunicipality?: string; // Demarcación territorial (subsección)
    companySettlementType?: string; // Tipo de asentamiento humano (subsección)
    companySettlementName?: string; // Nombre del asentamiento humano (subsección)
    companyStreetType?: string; // Vialidad (subsección)
    companyStreetName?: string; // Nombre de la vía (subsección)
    companyExteriorNumber?: string; // Número exterior (subsección)
    companyInteriorNumber?: string | null; // Número interior (subsección)
    companyPostalCode?: string; // Código postal (subsección)
    companyWebsite?: string | null; // Página Web (subsección)
    companyLinkedin?: string | null; // LinkedIn (subsección)
    
    // INFORMACIÓN DE CONTACTO EN LA EMPRESA (sección)
    contactName?: string; // Nombre de la persona de contacto (subsección)
    contactPosition?: string; // Puesto en la empresa (subsección)
    contactEmail?: string; // Dirección electrónica de correo (subsección)
    contactPhone?: string; // Número telefónico (subsección)
    contactArea?: string; // Nombre del área asociada (subsección)
    
    // SUPERVISOR DEL PROYECTO DE ESTANCIA O ESTADÍA (sección)
    supervisorName?: string; // Nombre del Supervisor (subsección)
    supervisorArea?: string; // Área de la empresa (subsección)
    supervisorEmail?: string; // Dirección electrónica de correo (subsección)
    supervisorPhone?: string; // Número de teléfono (subsección)
    
    // DATOS DEL PROYECTO (sección)
    projectName?: string; // Nombre del proyecto (subsección)
    projectStartDate?: Date; // Fecha de inicio (subsección)
    projectEndDate?: Date; // Fecha de cierre (subsección)
    projectProblemContext?: string; // Contexto de la problemática (subsección)
    projectProblemDescription?: string; // Problemática (subsección)
    projectGeneralObjective?: string; // Objetivo general (subsección)
    projectSpecificObjectives?: string; // Objetivos específicos (subsección)
    projectMainActivities?: string; // Principales actividades (subsección)
    projectPlannedDeliverables?: string; // Entregables planeados (subsección)
    projectTechnologies?: string; // Tecnologías a aplicar (subsección)
    
    // ESTATUS DE LA PROPUESTA
    proposalStatus?: ProposalStatus;
    
    // Control
    userUpdate?: number | null;
}

export interface PropuestaRepository {
    createPropuesta(data: PropuestaCreateData): Promise<Propuesta | null>;
    
    getPropuestas(): Promise<Propuesta[] | null>;
    
    getPropuestasByConvocatoria(convocatoriaId: number): Promise<Propuesta[] | null>;
    
    getPropuestasByStudent(studentId: number): Promise<Propuesta[] | null>;
    
    getPropuestasByStatus(status: ProposalStatus): Promise<Propuesta[] | null>;
    
    getPropuesta(uuid: string): Promise<Propuesta | null>;
    
    updatePropuesta(uuid: string, data: PropuestaUpdateData): Promise<Propuesta | null>;
    
    updateProposalStatus(uuid: string, status: ProposalStatus, userUpdate?: number): Promise<Propuesta | null>;
    
    checkExistingPropuesta(studentId: number, convocatoriaId: number): Promise<boolean>;
    
    getActiveConvocatoria(): Promise<{ 
        id: number; 
        uuid: string; 
        nombre: string; 
        pasantiasDisponibles: string[]; 
        profesoresDisponibles: any[] 
    } | null>;
}