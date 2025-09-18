// src/propuestas/domain/interfaces/propuestaRepository.ts
import { Propuesta } from "../models/propuesta";

export interface PropuestaCreateData {
    // Relaciones
    convocatoriaId: number;
    studentId: number;
    academicTutorId: number;
    academicTutorName: string;
    academicTutorEmail: string;
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
    projectStartDate: Date;
    projectEndDate: Date;
    projectProblemContext: string;
    projectProblemDescription: string;
    projectGeneralObjective: string;
    projectSpecificObjectives: string;
    projectMainActivities: string;
    projectPlannedDeliverables: string;
    projectTechnologies: string;
    
    // Control
    userCreation?: number | null;
}

export interface PropuestaUpdateData {
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
    projectStartDate?: Date;
    projectEndDate?: Date;
    projectProblemContext?: string;
    projectProblemDescription?: string;
    projectGeneralObjective?: string;
    projectSpecificObjectives?: string;
    projectMainActivities?: string;
    projectPlannedDeliverables?: string;
    projectTechnologies?: string;
    
    // Relaciones (solo tutor puede cambiar)
    academicTutorId?: number;
    academicTutorName?: string;
    academicTutorEmail?: string;
    internshipType?: string;
    
    // Control
    userUpdate?: number | null;
}

export interface PropuestaRepository {
    createPropuesta(data: PropuestaCreateData): Promise<Propuesta | null>;
    
    getPropuestas(): Promise<Propuesta[] | null>;
    
    getPropuestasByConvocatoria(convocatoriaId: number): Promise<Propuesta[] | null>;
    
    getPropuestasByStudent(studentId: number): Promise<Propuesta[] | null>;
    
    getPropuesta(uuid: string): Promise<Propuesta | null>;
    
    updatePropuesta(uuid: string, data: PropuestaUpdateData): Promise<Propuesta | null>;
    
    checkExistingPropuesta(studentId: number, convocatoriaId: number): Promise<boolean>;
    
    getActiveConvocatoria(): Promise<{ 
        id: number; 
        uuid: string; 
        nombre: string; 
        pasantiasDisponibles: string[]; 
        profesoresDisponibles: any[] 
    } | null>;
}