// src/propuestas/domain/models/propuesta.ts
export class Propuesta {
    constructor(
        private readonly id: number,
        private readonly uuid: string,
        
        // Relaciones
        private readonly convocatoriaId: number,
        private readonly studentId: number,
        private readonly academicTutorId: number,
        private readonly academicTutorName: string,
        private readonly academicTutorEmail: string,
        private readonly internshipType: string,
        
        // Información de la empresa
        private readonly companyShortName: string,
        private readonly companyLegalName: string,
        private readonly companyTaxId: string,
        
        // Dirección de la empresa
        private readonly companyState: string,
        private readonly companyMunicipality: string,
        private readonly companySettlementType: string,
        private readonly companySettlementName: string,
        private readonly companyStreetType: string,
        private readonly companyStreetName: string,
        private readonly companyExteriorNumber: string,
        private readonly companyInteriorNumber: string | null,
        private readonly companyPostalCode: string,
        private readonly companyWebsite: string | null,
        private readonly companyLinkedin: string | null,
        
        // Información de contacto
        private readonly contactName: string,
        private readonly contactPosition: string,
        private readonly contactEmail: string,
        private readonly contactPhone: string,
        private readonly contactArea: string,
        
        // Supervisor del proyecto
        private readonly supervisorName: string,
        private readonly supervisorArea: string,
        private readonly supervisorEmail: string,
        private readonly supervisorPhone: string,
        
        // Datos del proyecto
        private readonly projectName: string,
        private readonly projectStartDate: Date,
        private readonly projectEndDate: Date,
        private readonly projectProblemContext: string,
        private readonly projectProblemDescription: string,
        private readonly projectGeneralObjective: string,
        private readonly projectSpecificObjectives: string,
        private readonly projectMainActivities: string,
        private readonly projectPlannedDeliverables: string,
        private readonly projectTechnologies: string,
        
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
    getAcademicTutorId(): number { return this.academicTutorId; }
    getAcademicTutorName(): string { return this.academicTutorName; }
    getAcademicTutorEmail(): string { return this.academicTutorEmail; }
    getInternshipType(): string { return this.internshipType; }
    
    // Getters de información de empresa
    getCompanyShortName(): string { return this.companyShortName; }
    getCompanyLegalName(): string { return this.companyLegalName; }
    getCompanyTaxId(): string { return this.companyTaxId; }
    
    // Getters de dirección
    getCompanyState(): string { return this.companyState; }
    getCompanyMunicipality(): string { return this.companyMunicipality; }
    getCompanySettlementType(): string { return this.companySettlementType; }
    getCompanySettlementName(): string { return this.companySettlementName; }
    getCompanyStreetType(): string { return this.companyStreetType; }
    getCompanyStreetName(): string { return this.companyStreetName; }
    getCompanyExteriorNumber(): string { return this.companyExteriorNumber; }
    getCompanyInteriorNumber(): string | null { return this.companyInteriorNumber; }
    getCompanyPostalCode(): string { return this.companyPostalCode; }
    getCompanyWebsite(): string | null { return this.companyWebsite; }
    getCompanyLinkedin(): string | null { return this.companyLinkedin; }
    
    // Getters de contacto
    getContactName(): string { return this.contactName; }
    getContactPosition(): string { return this.contactPosition; }
    getContactEmail(): string { return this.contactEmail; }
    getContactPhone(): string { return this.contactPhone; }
    getContactArea(): string { return this.contactArea; }
    
    // Getters de supervisor
    getSupervisorName(): string { return this.supervisorName; }
    getSupervisorArea(): string { return this.supervisorArea; }
    getSupervisorEmail(): string { return this.supervisorEmail; }
    getSupervisorPhone(): string { return this.supervisorPhone; }
    
    // Getters de proyecto
    getProjectName(): string { return this.projectName; }
    getProjectStartDate(): Date { return this.projectStartDate; }
    getProjectEndDate(): Date { return this.projectEndDate; }
    getProjectProblemContext(): string { return this.projectProblemContext; }
    getProjectProblemDescription(): string { return this.projectProblemDescription; }
    getProjectGeneralObjective(): string { return this.projectGeneralObjective; }
    getProjectSpecificObjectives(): string { return this.projectSpecificObjectives; }
    getProjectMainActivities(): string { return this.projectMainActivities; }
    getProjectPlannedDeliverables(): string { return this.projectPlannedDeliverables; }
    getProjectTechnologies(): string { return this.projectTechnologies; }
    
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
            getDescripcion: () => this.projectProblemDescription, // Usar descripción del problema como descripción
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
            getNombre: () => this.companyShortName,
            getSector: () => this.contactArea, // Usar área de contacto como sector
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