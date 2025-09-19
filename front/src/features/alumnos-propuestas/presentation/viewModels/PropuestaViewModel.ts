// src/features/alumnos-propuestas/presentation/viewModels/PropuestaViewModel.ts
import { makeAutoObservable, runInAction } from "mobx";
import { PropuestaRepository } from "../../data/repository/PropuestaRepository";
import { GetConvocatoriaActivaUseCase } from "../../domain/GetConvocatoriaActivaUseCase";
import { CreatePropuestaUseCase, CreatePropuestaParams } from "../../domain/CreatePropuestaUseCase";
import { GetPropuestasByAlumnoUseCase } from "../../domain/GetPropuestasByAlumnoUseCase";
import { ConvocatoriaActiva, Propuesta, TutorAcademico } from "../../data/models/Propuesta";

export interface PropuestaFormData {
  // Step 1: Información del alumno
  academicTutorId: number | null;
  internshipType: string;
  
  // Step 2: Información de la empresa
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
  companyInteriorNumber: string;
  companyPostalCode: string;
  companyWebsite: string;
  companyLinkedin: string;
  
  // Información de contacto
  contactName: string;
  contactPosition: string;
  contactEmail: string;
  contactPhone: string;
  contactArea: string;
  
  // Step 3: Supervisor del proyecto
  supervisorName: string;
  supervisorArea: string;
  supervisorEmail: string;
  supervisorPhone: string;
  
  // Step 4: Información del proyecto
  projectName: string;
  projectStartDate: Date | null;
  projectEndDate: Date | null;
  projectProblemContext: string;
  projectProblemDescription: string;
  projectGeneralObjective: string;
  projectSpecificObjectives: string;
  projectMainActivities: string;
  projectPlannedDeliverables: string;
  projectTechnologies: string;
}

export class PropuestaViewModel {
  // Estados de UI
  loading: boolean = false;
  submitting: boolean = false;
  error: string | null = null;
  isInitialized: boolean = false;
  currentStep: number = 1;

  // Estados de datos
  convocatoriaActiva: ConvocatoriaActiva | null = null;
  misPropuestas: Propuesta[] = [];
  lastCreatedPropuesta: Propuesta | null = null;

  // Estados específicos de carga
  loadingConvocatoria: boolean = false;
  loadingPropuestas: boolean = false;

  // Datos del formulario
  formData: PropuestaFormData = {
    academicTutorId: null,
    internshipType: '',
    
    companyShortName: '',
    companyLegalName: '',
    companyTaxId: '',
    
    companyState: '',
    companyMunicipality: '',
    companySettlementType: '',
    companySettlementName: '',
    companyStreetType: '',
    companyStreetName: '',
    companyExteriorNumber: '',
    companyInteriorNumber: '',
    companyPostalCode: '',
    companyWebsite: '',
    companyLinkedin: '',
    
    contactName: '',
    contactPosition: '',
    contactEmail: '',
    contactPhone: '',
    contactArea: '',
    
    supervisorName: '',
    supervisorArea: '',
    supervisorEmail: '',
    supervisorPhone: '',
    
    projectName: '',
    projectStartDate: null,
    projectEndDate: null,
    projectProblemContext: '',
    projectProblemDescription: '',
    projectGeneralObjective: '',
    projectSpecificObjectives: '',
    projectMainActivities: '',
    projectPlannedDeliverables: '',
    projectTechnologies: ''
  };

  // Casos de uso
  private repository: PropuestaRepository;
  private getConvocatoriaActivaUseCase: GetConvocatoriaActivaUseCase;
  private createPropuestaUseCase: CreatePropuestaUseCase;
  private getPropuestasByAlumnoUseCase: GetPropuestasByAlumnoUseCase;

  constructor() {
    makeAutoObservable(this);

    this.repository = new PropuestaRepository();
    this.getConvocatoriaActivaUseCase = new GetConvocatoriaActivaUseCase(this.repository);
    this.createPropuestaUseCase = new CreatePropuestaUseCase(this.repository);
    this.getPropuestasByAlumnoUseCase = new GetPropuestasByAlumnoUseCase(this.repository);
  }

  // Setters para estados
  setLoading(loading: boolean) {
    this.loading = loading;
  }

  setSubmitting(submitting: boolean) {
    this.submitting = submitting;
  }

  setError(error: string | null) {
    this.error = error;
  }

  setCurrentStep(step: number) {
    this.currentStep = step;
  }

  setLoadingConvocatoria(loading: boolean) {
    this.loadingConvocatoria = loading;
  }

  setLoadingPropuestas(loading: boolean) {
    this.loadingPropuestas = loading;
  }

  setConvocatoriaActiva(convocatoria: ConvocatoriaActiva | null) {
    this.convocatoriaActiva = convocatoria;
  }

  setMisPropuestas(propuestas: Propuesta[]) {
    this.misPropuestas = propuestas;
  }

  setLastCreatedPropuesta(propuesta: Propuesta | null) {
    this.lastCreatedPropuesta = propuesta;
  }

  updateFormData(updates: Partial<PropuestaFormData>) {
    this.formData = { ...this.formData, ...updates };
  }

  // Método de inicialización
  async initialize(): Promise<void> {
    this.setLoading(true);
    this.setError(null);

    try {
      await Promise.all([
        this.loadConvocatoriaActiva(),
        this.loadMisPropuestas()
      ]);
    } catch (error: any) {
      this.setError(error.message || "Error al inicializar datos");
    } finally {
      runInAction(() => {
        this.isInitialized = true;
        this.setLoading(false);
      });
    }
  }

  // Cargar convocatoria activa
  async loadConvocatoriaActiva(): Promise<void> {
    this.setLoadingConvocatoria(true);
    
    try {
      const convocatoria = await this.getConvocatoriaActivaUseCase.execute();
      runInAction(() => {
        this.setConvocatoriaActiva(convocatoria);
      });
    } catch (error: any) {
      runInAction(() => {
        this.setConvocatoriaActiva(null);
        console.error("Error al cargar convocatoria activa:", error);
      });
    } finally {
      this.setLoadingConvocatoria(false);
    }
  }

  // Cargar propuestas del alumno
  async loadMisPropuestas(): Promise<void> {
    this.setLoadingPropuestas(true);
    
    try {
      const propuestas = await this.getPropuestasByAlumnoUseCase.execute();
      runInAction(() => {
        this.setMisPropuestas(propuestas);
      });
    } catch (error: any) {
      runInAction(() => {
        this.setMisPropuestas([]);
        console.error("Error al cargar mis propuestas:", error);
      });
    } finally {
      this.setLoadingPropuestas(false);
    }
  }

  // Crear nueva propuesta
  async createPropuesta(): Promise<boolean> {
    this.setSubmitting(true);
    this.setError(null);

    try {
      const params: CreatePropuestaParams = {
        academicTutorId: this.formData.academicTutorId!,
        internshipType: this.formData.internshipType,
        
        // Información de la empresa
        companyShortName: this.formData.companyShortName,
        companyLegalName: this.formData.companyLegalName,
        companyTaxId: this.formData.companyTaxId,
        
        // Dirección de la empresa
        companyState: this.formData.companyState,
        companyMunicipality: this.formData.companyMunicipality,
        companySettlementType: this.formData.companySettlementType,
        companySettlementName: this.formData.companySettlementName,
        companyStreetType: this.formData.companyStreetType,
        companyStreetName: this.formData.companyStreetName,
        companyExteriorNumber: this.formData.companyExteriorNumber,
        companyInteriorNumber: this.formData.companyInteriorNumber || null,
        companyPostalCode: this.formData.companyPostalCode,
        companyWebsite: this.formData.companyWebsite || null,
        companyLinkedin: this.formData.companyLinkedin || null,
        
        // Información de contacto
        contactName: this.formData.contactName,
        contactPosition: this.formData.contactPosition,
        contactEmail: this.formData.contactEmail,
        contactPhone: this.formData.contactPhone,
        contactArea: this.formData.contactArea,
        
        // Supervisor del proyecto
        supervisorName: this.formData.supervisorName,
        supervisorArea: this.formData.supervisorArea,
        supervisorEmail: this.formData.supervisorEmail,
        supervisorPhone: this.formData.supervisorPhone,
        
        // Datos del proyecto
        projectName: this.formData.projectName,
        projectStartDate: this.formData.projectStartDate!,
        projectEndDate: this.formData.projectEndDate!,
        projectProblemContext: this.formData.projectProblemContext,
        projectProblemDescription: this.formData.projectProblemDescription,
        projectGeneralObjective: this.formData.projectGeneralObjective,
        projectSpecificObjectives: this.formData.projectSpecificObjectives,
        projectMainActivities: this.formData.projectMainActivities,
        projectPlannedDeliverables: this.formData.projectPlannedDeliverables,
        projectTechnologies: this.formData.projectTechnologies
      };

      const propuesta = await this.createPropuestaUseCase.execute(params);
      
      runInAction(() => {
        this.setLastCreatedPropuesta(propuesta);
        // Agregar la nueva propuesta a la lista
        this.setMisPropuestas([propuesta, ...this.misPropuestas]);
      });

      return true;
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Error al crear la propuesta");
      });
      return false;
    } finally {
      this.setSubmitting(false);
    }
  }

  // Navegación entre steps
  nextStep() {
    if (this.currentStep < 4) {
      this.setCurrentStep(this.currentStep + 1);
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.setCurrentStep(this.currentStep - 1);
    }
  }

  goToStep(step: number) {
    if (step >= 1 && step <= 4) {
      this.setCurrentStep(step);
    }
  }

  // Getters calculados
  get hasConvocatoriaActiva(): boolean {
    return this.convocatoriaActiva !== null;
  }

  get tutoresDisponibles(): TutorAcademico[] {
    return this.convocatoriaActiva?.getProfesoresDisponibles() || [];
  }

  get pasantiasDisponibles(): string[] {
    return this.convocatoriaActiva?.getPasantiasDisponibles() || [];
  }

  get hasPropuestaEnConvocatoriaActual(): boolean {
    if (!this.convocatoriaActiva) {
      return false;
    }
    
    const convocatoriaId = this.convocatoriaActiva.getId();
    const result = this.misPropuestas.some(propuesta => {
      const propuestaConvocatoriaId = propuesta.getIdConvocatoria();
      return propuestaConvocatoriaId.toString() === convocatoriaId.toString();
    });
    
    return result;
  }

  get canCreatePropuesta(): boolean {
    return this.hasConvocatoriaActiva && 
           !this.hasPropuestaEnConvocatoriaActual &&
           !this.loadingConvocatoria &&
           !this.loadingPropuestas;
  }

  get isStep1Valid(): boolean {
    return this.formData.academicTutorId !== null && 
           this.formData.internshipType !== '';
  }

  get isStep2Valid(): boolean {
    return this.formData.companyShortName !== '' &&
           this.formData.companyLegalName !== '' &&
           this.formData.companyTaxId !== '' &&
           this.formData.companyState !== '' &&
           this.formData.companyMunicipality !== '' &&
           this.formData.companySettlementType !== '' &&
           this.formData.companySettlementName !== '' &&
           this.formData.companyStreetType !== '' &&
           this.formData.companyStreetName !== '' &&
           this.formData.companyExteriorNumber !== '' &&
           this.formData.companyPostalCode !== '' &&
           this.formData.contactName !== '' &&
           this.formData.contactPosition !== '' &&
           this.formData.contactEmail !== '' &&
           this.formData.contactPhone !== '' &&
           this.formData.contactArea !== '';
  }

  get isStep3Valid(): boolean {
    return this.formData.supervisorName !== '' &&
           this.formData.supervisorArea !== '' &&
           this.formData.supervisorEmail !== '' &&
           this.formData.supervisorPhone !== '';
  }

  get isStep4Valid(): boolean {
    return this.formData.projectName !== '' &&
           this.formData.projectProblemContext !== '' &&
           this.formData.projectProblemDescription !== '' &&
           this.formData.projectGeneralObjective !== '' &&
           this.formData.projectSpecificObjectives !== '' &&
           this.formData.projectMainActivities !== '' &&
           this.formData.projectPlannedDeliverables !== '' &&
           this.formData.projectTechnologies !== '' &&
           this.formData.projectStartDate !== null &&
           this.formData.projectEndDate !== null;
  }

  get isFormComplete(): boolean {
    return this.isStep1Valid && this.isStep2Valid && this.isStep3Valid && this.isStep4Valid;
  }

  get stepProgress(): number {
    const totalSteps = 4;
    return (this.currentStep / totalSteps) * 100;
  }

  // Obtener tutor seleccionado
  get selectedTutor(): TutorAcademico | null {
    if (!this.formData.academicTutorId) return null;
    
    return this.tutoresDisponibles.find(tutor => 
      tutor.getId() === this.formData.academicTutorId
    ) || null;
  }

  // Formatear fecha para inputs
  formatDateForInput(date: Date | null): string {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  }

  // Parsear fecha desde input
  parseDateFromInput(dateString: string): Date | null {
    if (!dateString) return null;
    return new Date(dateString);
  }

  // Limpiar errores
  clearError() {
    this.setError(null);
  }

  // Resetear formulario
  resetForm() {
    this.formData = {
      academicTutorId: null,
      internshipType: '',
      
      companyShortName: '',
      companyLegalName: '',
      companyTaxId: '',
      
      companyState: '',
      companyMunicipality: '',
      companySettlementType: '',
      companySettlementName: '',
      companyStreetType: '',
      companyStreetName: '',
      companyExteriorNumber: '',
      companyInteriorNumber: '',
      companyPostalCode: '',
      companyWebsite: '',
      companyLinkedin: '',
      
      contactName: '',
      contactPosition: '',
      contactEmail: '',
      contactPhone: '',
      contactArea: '',
      
      supervisorName: '',
      supervisorArea: '',
      supervisorEmail: '',
      supervisorPhone: '',
      
      projectName: '',
      projectStartDate: null,
      projectEndDate: null,
      projectProblemContext: '',
      projectProblemDescription: '',
      projectGeneralObjective: '',
      projectSpecificObjectives: '',
      projectMainActivities: '',
      projectPlannedDeliverables: '',
      projectTechnologies: ''
    };
    this.setCurrentStep(1);
    this.clearError();
  }

  // Resetear el ViewModel
  reset() {
    this.loading = false;
    this.submitting = false;
    this.error = null;
    this.isInitialized = false;
    this.currentStep = 1;
    this.convocatoriaActiva = null;
    this.misPropuestas = [];
    this.lastCreatedPropuesta = null;
    this.loadingConvocatoria = false;
    this.loadingPropuestas = false;
    this.resetForm();
  }
}