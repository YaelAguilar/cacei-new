// src/propuestas/domain/interfaces/propuestaRepository.ts
import { Propuesta } from "../models/propuesta";

export interface PropuestaCreateData {
    idConvocatoria: number;
    idAlumno: number;
    tutorAcademicoId: number;
    tipoPasantia: string;
    nombreProyecto: string;
    descripcionProyecto: string;
    entregables: string;
    tecnologias: string;
    supervisorProyecto: string;
    actividades: string;
    fechaInicio: Date;
    fechaFin: Date;
    nombreEmpresa: string;
    sectorEmpresa: string;
    personaContacto: string;
    paginaWebEmpresa?: string | null;
}

export interface PropuestaUpdateData {
    tutorAcademicoId?: number;
    tipoPasantia?: string;
    nombreProyecto?: string;
    descripcionProyecto?: string;
    entregables?: string;
    tecnologias?: string;
    supervisorProyecto?: string;
    actividades?: string;
    fechaInicio?: Date;
    fechaFin?: Date;
    nombreEmpresa?: string;
    sectorEmpresa?: string;
    personaContacto?: string;
    paginaWebEmpresa?: string | null;
}

export interface PropuestaRepository {
    createPropuesta(data: PropuestaCreateData): Promise<Propuesta | null>;
    
    getPropuestas(): Promise<Propuesta[] | null>;
    
    getPropuestasByConvocatoria(convocatoriaId: number): Promise<Propuesta[] | null>;
    
    getPropuestasByAlumno(alumnoId: number): Promise<Propuesta[] | null>;
    
    getPropuesta(uuid: string): Promise<Propuesta | null>;
    
    updatePropuesta(uuid: string, data: PropuestaUpdateData): Promise<Propuesta | null>;
    
    checkExistingPropuesta(alumnoId: number, convocatoriaId: number): Promise<boolean>;
    
    getActiveConvocatoria(): Promise<{ id: number; uuid: string; nombre: string; pasantiasDisponibles: string[]; profesoresDisponibles: any[] } | null>;
}