// src/features/alumnos-propuestas/presentation/viewModels/PropuestaViewModel.ts
import { makeAutoObservable, runInAction } from "mobx";
import { PropuestaRepository } from "../../data/repository/PropuestaRepository";
import { GetConvocatoriaActivaUseCase } from "../../domain/GetConvocatoriaActivaUseCase";
import { CreatePropuestaUseCase, CreatePropuestaParams } from "../../domain/CreatePropuestaUseCase";
import { GetPropuestasByAlumnoUseCase } from "../../domain/GetPropuestasByAlumnoUseCase";
import { ConvocatoriaActiva, Propuesta, TutorAcademico } from "../../data/models/Propuesta";
import { PropuestaRealTimeValidation } from "../validations/PropuestaSchema";
import { AuthViewModel } from "../../../auth/presentation/viewModels/AuthViewModel";

export interface PropuestaFormData {
  // Step 1: Información del alumno
  academicTutorId: number | null;
  internshipType: string;
  
  // Step 2: Información de la empresa
  companyShortName: string; // Puede ser null en el backend, pero manejamos como string en el form
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
  companyInteriorNumber: string; // Puede ser null en el backend, pero manejamos como string en el form
  companyPostalCode: string;
  companyWebsite: string; // Puede ser null en el backend, pero manejamos como string en el form
  companyLinkedin: string; // Puede ser null en el backend, pero manejamos como string en el form
  
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

  // NUEVO: Referencia al AuthViewModel para obtener información del usuario
  private authViewModel: AuthViewModel | null = null;

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

  constructor(authViewModel?: AuthViewModel) {
    makeAutoObservable(this);

    // NUEVO: Inyectar el AuthViewModel para obtener información del usuario
    this.authViewModel = authViewModel || null;

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

  setConvocatoriaActiva(convocatoria: ConvocatoriaActiva | null) {
    this.convocatoriaActiva = convocatoria;
  }

  setMisPropuestas(propuestas: Propuesta[]) {
    this.misPropuestas = propuestas;
  }

  setLastCreatedPropuesta(propuesta: Propuesta | null) {
    this.lastCreatedPropuesta = propuesta;
  }

  setCurrentStep(step: number) {
    this.currentStep = step;
  }

  // NUEVOS GETTERS para información del usuario actual
  get currentUserName(): string {
    if (!this.authViewModel?.currentUser) {
      return 'Usuario no disponible';
    }
    
    return this.authViewModel.currentUser.getFullName();
  }

  get currentUserEmail(): string {
    if (!this.authViewModel?.currentUser) {
      return 'Email no disponible';
    }
    
    return this.authViewModel.currentUser.getEmail();
  }

  get currentUserUuid(): string | null {
    if (!this.authViewModel?.currentUser) {
      return null;
    }
    
    return this.authViewModel.currentUser.getUuid() || null;
  }

  // MÉTODO para establecer el AuthViewModel después de la construcción
  setAuthViewModel(authViewModel: AuthViewModel) {
    this.authViewModel = authViewModel;
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
      this.setError(error.message || "Error al cargar los datos");
    } finally {
      runInAction(() => {
        this.isInitialized = true;
        this.setLoading(false);
      });
    }
  }

  // Cargar convocatoria activa
  async loadConvocatoriaActiva(): Promise<void> {
    this.loadingConvocatoria = true;

    try {
      const convocatoria = await this.getConvocatoriaActivaUseCase.execute();
      runInAction(() => {
        this.setConvocatoriaActiva(convocatoria);
      });
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Error al cargar la convocatoria activa");
      });
    } finally {
      this.loadingConvocatoria = false;
    }
  }

  // Cargar mis propuestas
  async loadMisPropuestas(): Promise<void> {
    this.loadingPropuestas = true;

    try {
      const propuestas = await this.getPropuestasByAlumnoUseCase.execute();
      runInAction(() => {
        this.setMisPropuestas(propuestas);
      });
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Error al cargar las propuestas");
      });
    } finally {
      this.loadingPropuestas = false;
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
        
        companyShortName: this.formData.companyShortName || '',
        companyLegalName: this.formData.companyLegalName,
        companyTaxId: this.formData.companyTaxId,
        
        companyState: this.formData.companyState,
        companyMunicipality: this.formData.companyMunicipality,
        companySettlementType: this.formData.companySettlementType,
        companySettlementName: this.formData.companySettlementName,
      companyStreetType: this.formData.companyStreetType,
      companyStreetName: this.formData.companyStreetName,
      companyExteriorNumber: this.formData.companyExteriorNumber,
      companyInteriorNumber: this.formData.companyInteriorNumber,
      companyPostalCode: this.formData.companyPostalCode,
      companyWebsite: this.formData.companyWebsite,
      companyLinkedin: this.formData.companyLinkedin,
      contactName: this.formData.contactName,
      contactPosition: this.formData.contactPosition,
      contactEmail: this.formData.contactEmail,
      contactPhone: this.formData.contactPhone,
      contactArea: this.formData.contactArea
    };
    return PropuestaRealTimeValidation.validateStep2(step2Data);
  }

  get isStep3Valid(): boolean {
    const step3Data = {
      supervisorName: this.formData.supervisorName,
      supervisorArea: this.formData.supervisorArea,
      supervisorEmail: this.formData.supervisorEmail,
      supervisorPhone: this.formData.supervisorPhone
    };
    return PropuestaRealTimeValidation.validateStep3(step3Data);
  }

  get isStep4Valid(): boolean {
    const step4Data = {
      projectName: this.formData.projectName,
      projectStartDate: this.formData.projectStartDate,
      projectEndDate: this.formData.projectEndDate,
      projectProblemContext: this.formData.projectProblemContext,
      projectProblemDescription: this.formData.projectProblemDescription,
      projectGeneralObjective: this.formData.projectGeneralObjective,
      projectSpecificObjectives: this.formData.projectSpecificObjectives,
      projectMainActivities: this.formData.projectMainActivities,
      projectPlannedDeliverables: this.formData.projectPlannedDeliverables,
      projectTechnologies: this.formData.projectTechnologies
    };
    return PropuestaRealTimeValidation.validateStep4(step4Data);
  }

  get isFormValid(): boolean {
    return this.isStep1Valid && this.isStep2Valid && this.isStep3Valid && this.isStep4Valid;
  }

  // Utilidades para fechas
  formatDateForInput(date: Date | null): string {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  }

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
    this.setLastCreatedPropuesta(null);
  }

  // Reset completo
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
        companyStreetType: this.formData.companyStreetType,
        companyStreetName: this.formData.companyStreetName,
        companyExteriorNumber: this.formData.companyExteriorNumber,
        companyInteriorNumber: this.formData.companyInteriorNumber || null,
        companyPostalCode: this.formData.companyPostalCode,
        companyWebsite: this.formData.companyWebsite || null,
        companyLinkedin: this.formData.companyLinkedin || null,
        
        contactName: this.formData.contactName,
        contactPosition: this.formData.contactPosition,
        contactEmail: this.formData.contactEmail,
        contactPhone: this.formData.contactPhone,
        contactArea: this.formData.contactArea,
        
        supervisorName: this.formData.supervisorName,
        supervisorArea: this.formData.supervisorArea,
        supervisorEmail: this.formData.supervisorEmail,
        supervisorPhone: this.formData.supervisorPhone,
        
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
        // Actualizar la lista de mis propuestas
        this.setMisPropuestas([...this.misPropuestas, propuesta]);
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

  // Navegación entre pasos
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

  // Actualizar datos del formulario
  updateFormData(data: Partial<PropuestaFormData>) {
    this.formData = { ...this.formData, ...data };
  }

  // Getters calculados
  get hasConvocatoriaActiva(): boolean {
    return this.convocatoriaActiva !== null;
  }

  get hasPropuestaEnConvocatoriaActual(): boolean {
    if (!this.convocatoriaActiva || this.misPropuestas.length === 0) {
      return false;
    }
    
    return this.misPropuestas.some(propuesta => 
      propuesta.getIdConvocatoria().toString() === this.convocatoriaActiva!.getId()
    );
  }

  get canCreatePropuesta(): boolean {
    return this.hasConvocatoriaActiva && !this.hasPropuestaEnConvocatoriaActual;
  }

  get tutoresDisponibles(): TutorAcademico[] {
    return this.convocatoriaActiva ? this.convocatoriaActiva.getProfesoresDisponibles() : [];
  }

  get pasantiasDisponibles(): string[] {
    return this.convocatoriaActiva ? this.convocatoriaActiva.getPasantiasDisponibles() : [];
  }

  get selectedTutor(): TutorAcademico | null {
    if (!this.formData.academicTutorId || !this.convocatoriaActiva) {
      return null;
    }
    
    return this.tutoresDisponibles.find(tutor => 
      tutor.getId() === this.formData.academicTutorId
    ) || null;
  }

  // Validaciones de pasos
  get isStep1Valid(): boolean {
    const step1Data = {
      academicTutorId: this.formData.academicTutorId,
      internshipType: this.formData.internshipType
    };
    return PropuestaRealTimeValidation.validateStep1(step1Data);
  }

  get isStep2Valid(): boolean {
    const step2Data = {
      companyShortName: this.formData.companyShortName,
      companyLegalName: this.formData.companyLegalName,
      companyTaxId: this.formData.companyTaxId,
      companyState: this.formData.companyState,
      companyMunicipality: this.formData.companyMunicipality,
      companySettlementType: this.formData.companySettlementType,
      companySettlementName: this.formData.companySettlementName,