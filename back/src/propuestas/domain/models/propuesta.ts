// src/propuestas/domain/models/propuesta.ts
export type ProposalStatus = 'PENDIENTE' | 'APROBADO' | 'RECHAZADO' | 'ACTUALIZAR';

export class Propuesta {
    constructor(
        private readonly id: number,
        private readonly uuid: string,
        
        // Relaciones
        private readonly convocatoriaId: number,
        private readonly studentId: number,
        
        // INFORMACIÓN DEL ALUMNO (sección) - ACTUALIZADA
        private readonly studentName: string, // NUEVO: Nombre completo del estudiante
        private readonly studentEmail: string, // NUEVO: Email del estudiante
        private readonly academicTutorId: number, // tutor académico (subsección)
        private readonly academicTutorName: string,
        private readonly academicTutorEmail: string,
        private readonly internshipType: string, // Pasantía a realizar (subsección)
        
        // INFORMACIÓN DE LA EMPRESA (sección)
        private readonly companyShortName: string | null, // Nombre corto (subsección) - OPCIONAL
        private readonly companyLegalName: string, // Nombre legal (subsección)
        private readonly companyTaxId: string, // RFC - Registro Federal de Contribuyentes (subsección)
        
        // DIRECCIÓN FÍSICA Y EN LA WEB DE LA EMPRESA (sección)
        private readonly companyState: string, // Entidad federativa (subsección)
        private readonly companyMunicipality: string, // Demarcación territorial (subsección)
        private readonly companySettlementType: string, // Tipo de asentamiento humano (subsección)
        private readonly companySettlementName: string, // Nombre del asentamiento humano (subsección)
        private readonly companyStreetType: string, // Vialidad (subsección)
        private readonly companyStreetName: string, // Nombre de la vía (subsección)
        private readonly companyExteriorNumber: string, // Número exterior (subsección)
        private readonly companyInteriorNumber: string | null, // Número interior (subsección) - OPCIONAL
        private readonly companyPostalCode: string, // Código postal (subsección)
        private readonly companyWebsite: string | null, // Página Web (subsección) - OPCIONAL
        private readonly companyLinkedin: string | null, // LinkedIn (subsección) - OPCIONAL
        
        // INFORMACIÓN DE CONTACTO EN LA EMPRESA (sección)
        private readonly contactName: string, // Nombre de la persona de contacto (subsección)
        private readonly contactPosition: string, // Puesto en la empresa de la persona de contacto (subsección)
        private readonly contactEmail: string, // Dirección electrónica de correo (subsección)
        private readonly contactPhone: string, // Número telefónico (subsección)
        private readonly contactArea: string, // Nombre del área asociada (subsección)
        
        // SUPERVISOR DEL PROYECTO DE ESTANCIA O ESTADÍA (sección)
        private readonly supervisorName: string, // Nombre del Supervisor (subsección)
        private readonly supervisorArea: string, // Área de la empresa en la que se desarrollará el proyecto (subsección)
        private readonly supervisorEmail: string, // Dirección electrónica de correo (subsección)
        private readonly supervisorPhone: string, // Número de teléfono (subsección)
        
        // DATOS DEL PROYECTO (sección)
        private readonly projectName: string, // Nombre del proyecto (subsección)
        private readonly projectStartDate: Date, // Fecha de inicio del proyecto (subsección)
        private readonly projectEndDate: Date, // Fecha de cierre del proyecto (subsección)
        private readonly projectProblemContext: string, // Contexto de la problemática (subsección)
        private readonly projectProblemDescription: string, // Problemática (subsección)
        private readonly projectGeneralObjective: string, // Objetivo general del proyecto a desarrollar (subsección)
        private readonly projectSpecificObjectives: string, // Objetivos específicos del proyecto (subsección)
        private readonly projectMainActivities: string, // Principales actividades a realizar en la estancia o estadía (subsección)
        private readonly projectPlannedDeliverables: string, // Entregables planeados del proyecto (subsección)
        private readonly projectTechnologies: string, // Tecnologías a aplicar en el proyecto (subsección)
        
        // ESTATUS DE LA PROPUESTA
        private readonly proposalStatus: ProposalStatus, // Estatus de la propuesta
        
        // Campos de control
        private readonly active?: boolean,
        private readonly createdAt?: Date,
        private readonly updatedAt?: Date,
        private readonly userCreation?: number | null,
        private readonly userUpdate?: number | null
    ) {}

    // Getters básicos
    getId(): number { return this.id; }
    getUuid(): string { return this.uuid; }
    
    // Getters de relaciones
    getConvocatoriaId(): number { return this.convocatoriaId; }
    getStudentId(): number { return this.studentId; }
    
    // INFORMACIÓN DEL ALUMNO (sección) - Getters ACTUALIZADOS
    getStudentName(): string { return this.studentName; } // NUEVO
    getStudentEmail(): string { return this.studentEmail; } // NUEVO
    getAcademicTutorId(): number { return this.academicTutorId; } // tutor académico (subsección)
    getAcademicTutorName(): string { return this.academicTutorName; }
    getAcademicTutorEmail(): string { return this.academicTutorEmail; }
    getInternshipType(): string { return this.internshipType; } // Pasantía a realizar (subsección)
    
    // INFORMACIÓN DE LA EMPRESA (sección) - Getters
    getCompanyShortName(): string | null { return this.companyShortName; } // Nombre corto (subsección)
    getCompanyLegalName(): string { return this.companyLegalName; } // Nombre legal (subsección)
    getCompanyTaxId(): string { return this.companyTaxId; } // RFC (subsección)
    
    // DIRECCIÓN FÍSICA Y EN LA WEB DE LA EMPRESA (sección) - Getters
    getCompanyState(): string { return this.companyState; } // Entidad federativa (subsección)
    getCompanyMunicipality(): string { return this.companyMunicipality; } // Demarcación territorial (subsección)
    getCompanySettlementType(): string { return this.companySettlementType; } // Tipo de asentamiento humano (subsección)
    getCompanySettlementName(): string { return this.companySettlementName; } // Nombre del asentamiento humano (subsección)
    getCompanyStreetType(): string { return this.companyStreetType; } // Vialidad (subsección)
    getCompanyStreetName(): string { return this.companyStreetName; } // Nombre de la vía (subsección)
    getCompanyExteriorNumber(): string { return this.companyExteriorNumber; } // Número exterior (subsección)
    getCompanyInteriorNumber(): string | null { return this.companyInteriorNumber; } // Número interior (subsección)
    getCompanyPostalCode(): string { return this.companyPostalCode; } // Código postal (subsección)
    getCompanyWebsite(): string | null { return this.companyWebsite; } // Página Web (subsección)
    getCompanyLinkedin(): string | null { return this.companyLinkedin; } // LinkedIn (subsección)
    
    // INFORMACIÓN DE CONTACTO EN LA EMPRESA (sección) - Getters
    getContactName(): string { return this.contactName; } // Nombre de la persona de contacto (subsección)
    getContactPosition(): string { return this.contactPosition; } // Puesto en la empresa (subsección)
    getContactEmail(): string { return this.contactEmail; } // Dirección electrónica de correo (subsección)
    getContactPhone(): string { return this.contactPhone; } // Número telefónico (subsección)
    getContactArea(): string { return this.contactArea; } // Nombre del área asociada (subsección)
    
    // SUPERVISOR DEL PROYECTO DE ESTANCIA O ESTADÍA (sección) - Getters
    getSupervisorName(): string { return this.supervisorName; } // Nombre del Supervisor (subsección)
    getSupervisorArea(): string { return this.supervisorArea; } // Área de la empresa (subsección)
    getSupervisorEmail(): string { return this.supervisorEmail; } // Dirección electrónica de correo (subsección)
    getSupervisorPhone(): string { return this.supervisorPhone; } // Número de teléfono (subsección)
    
    // DATOS DEL PROYECTO (sección) - Getters
    getProjectName(): string { return this.projectName; } // Nombre del proyecto (subsección)
    getProjectStartDate(): Date { return this.projectStartDate; } // Fecha de inicio (subsección)
    getProjectEndDate(): Date { return this.projectEndDate; } // Fecha de cierre (subsección)
    getProjectProblemContext(): string { return this.projectProblemContext; } // Contexto de la problemática (subsección)
    getProjectProblemDescription(): string { return this.projectProblemDescription; } // Problemática (subsección)
    getProjectGeneralObjective(): string { return this.projectGeneralObjective; } // Objetivo general (subsección)
    getProjectSpecificObjectives(): string { return this.projectSpecificObjectives; } // Objetivos específicos (subsección)
    getProjectMainActivities(): string { return this.projectMainActivities; } // Principales actividades (subsección)
    getProjectPlannedDeliverables(): string { return this.projectPlannedDeliverables; } // Entregables planeados (subsección)
    getProjectTechnologies(): string { return this.projectTechnologies; } // Tecnologías a aplicar (subsección)
    
    // ESTATUS DE LA PROPUESTA - Getter
    getProposalStatus(): ProposalStatus { return this.proposalStatus; }
    
    // Getters de control
    isActive(): boolean | undefined { return this.active; }
    getCreatedAt(): Date | undefined { return this.createdAt; }
    getUpdatedAt(): Date | undefined { return this.updatedAt; }
    getUserCreation(): number | null | undefined { return this.userCreation; }
    getUserUpdate(): number | null | undefined { return this.userUpdate; }
    
    // Métodos de conveniencia para el frontend (mantener compatibilidad)
    getTutorAcademico() {
        return {
            getId: () => this.academicTutorId,
            getNombre: () => this.academicTutorName,
            getEmail: () => this.academicTutorEmail
        };
    }
    
    getProyecto() {
        return {
            getNombre: () => this.projectName,
            getDescripcion: () => this.projectProblemDescription,
            getEntregables: () => this.projectPlannedDeliverables,
            getTecnologias: () => this.projectTechnologies,
            getSupervisor: () => this.supervisorName,
            getActividades: () => this.projectMainActivities,
            getFechaInicio: () => this.projectStartDate,
            getFechaFin: () => this.projectEndDate
        };
    }
    
    getEmpresa() {
        return {
            getNombre: () => this.companyShortName || this.companyLegalName,
            getSector: () => this.contactArea,
            getPersonaContacto: () => this.contactName,
            getPaginaWeb: () => this.companyWebsite
        };
    }
    
    // Para compatibilidad con el frontend existente
    getTipoPasantia(): string { return this.internshipType; }
    getIdConvocatoria(): number { return this.convocatoriaId; }
    getFechaInicio(): Date { return this.projectStartDate; }
    getFechaFin(): Date { return this.projectEndDate; }
}