// src/features/alumnos-propuestas/presentation/viewModels/PropuestaViewModel.ts
import { makeAutoObservable, runInAction } from "mobx";
import { PropuestaRepository } from "../../data/repository/PropuestaRepository";
import { GetConvocatoriaActivaUseCase } from "../../domain/GetConvocatoriaActivaUseCase";
import { CreatePropuestaUseCase, CreatePropuestaParams } from "../../domain/CreatePropuestaUseCase";
import { GetPropuestasByAlumnoUseCase } from "../../domain/GetPropuestasByAlumnoUseCase";
import { ConvocatoriaActiva, Propuesta, TutorAcademico } from "../../data/models/Propuesta";

export interface PropuestaFormData {
  // Step 1: Información del alumno
  tutorAcademicoId: number | null;
  tipoPasantia: string;
  
  // Step 2: Información del proyecto
  nombreProyecto: string;
  descripcionProyecto: string;
  entregables: string;
  tecnologias: string;
  supervisorProyecto: string;
  actividades: string;
  fechaInicio: Date | null;
  fechaFin: Date | null;
  
  // Step 3: Información de la empresa
  nombreEmpresa: string;
  sectorEmpresa: string;
  personaContacto: string;
  paginaWebEmpresa: string;
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
    tutorAcademicoId: null,
    tipoPasantia: '',
    nombreProyecto: '',
    descripcionProyecto: '',
    entregables: '',
    tecnologias: '',
    supervisorProyecto: '',
    actividades: '',
    fechaInicio: null,
    fechaFin: null,
    nombreEmpresa: '',
    sectorEmpresa: '',
    personaContacto: '',
    paginaWebEmpresa: ''
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
        tutorAcademicoId: this.formData.tutorAcademicoId!,
        tipoPasantia: this.formData.tipoPasantia,
        nombreProyecto: this.formData.nombreProyecto,
        descripcionProyecto: this.formData.descripcionProyecto,
        entregables: this.formData.entregables,
        tecnologias: this.formData.tecnologias,
        supervisorProyecto: this.formData.supervisorProyecto,
        actividades: this.formData.actividades,
        fechaInicio: this.formData.fechaInicio!,
        fechaFin: this.formData.fechaFin!,
        nombreEmpresa: this.formData.nombreEmpresa,
        sectorEmpresa: this.formData.sectorEmpresa,
        personaContacto: this.formData.personaContacto,
        paginaWebEmpresa: this.formData.paginaWebEmpresa || null
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
    if (this.currentStep < 3) {
      this.setCurrentStep(this.currentStep + 1);
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.setCurrentStep(this.currentStep - 1);
    }
  }

  goToStep(step: number) {
    if (step >= 1 && step <= 3) {
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
    if (!this.convocatoriaActiva) return false;
    
    return this.misPropuestas.some(propuesta => 
      propuesta.getIdConvocatoria().toString() === this.convocatoriaActiva!.getId()
    );
  }

  get canCreatePropuesta(): boolean {
    return this.hasConvocatoriaActiva && 
           !this.hasPropuestaEnConvocatoriaActual &&
           !this.loadingConvocatoria &&
           !this.loadingPropuestas;
  }

  get isStep1Valid(): boolean {
    return this.formData.tutorAcademicoId !== null && 
           this.formData.tipoPasantia !== '';
  }

  get isStep2Valid(): boolean {
    return this.formData.nombreProyecto !== '' &&
           this.formData.descripcionProyecto !== '' &&
           this.formData.entregables !== '' &&
           this.formData.tecnologias !== '' &&
           this.formData.supervisorProyecto !== '' &&
           this.formData.actividades !== '' &&
           this.formData.fechaInicio !== null &&
           this.formData.fechaFin !== null;
  }

  get isStep3Valid(): boolean {
    return this.formData.nombreEmpresa !== '' &&
           this.formData.sectorEmpresa !== '' &&
           this.formData.personaContacto !== '';
  }

  get isFormComplete(): boolean {
    return this.isStep1Valid && this.isStep2Valid && this.isStep3Valid;
  }

  get stepProgress(): number {
    const totalSteps = 3;
    return (this.currentStep / totalSteps) * 100;
  }

  // Obtener tutor seleccionado
  get selectedTutor(): TutorAcademico | null {
    if (!this.formData.tutorAcademicoId) return null;
    
    return this.tutoresDisponibles.find(tutor => 
      tutor.getId() === this.formData.tutorAcademicoId
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
      tutorAcademicoId: null,
      tipoPasantia: '',
      nombreProyecto: '',
      descripcionProyecto: '',
      entregables: '',
      tecnologias: '',
      supervisorProyecto: '',
      actividades: '',
      fechaInicio: null,
      fechaFin: null,
      nombreEmpresa: '',
      sectorEmpresa: '',
      personaContacto: '',
      paginaWebEmpresa: ''
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