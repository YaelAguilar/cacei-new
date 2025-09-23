import { makeAutoObservable, runInAction } from "mobx";
import { ConvocatoriaRepository } from "../../data/repository/ConvocatoriaRepository";
import { CreateConvocatoriaUseCase, CreateConvocatoriaParams } from "../../domain/CreateConvocatoriaUseCase";
import { GetProfesoresUseCase } from "../../domain/GetProfesoresUseCase";
import { CheckActiveConvocatoriaUseCase } from "../../domain/CheckActiveConvocatoriaUseCase";
import { Profesor, Convocatoria } from "../../data/models/Convocatoria";

export class ConvocatoriaViewModel {
  // Estados de UI
  loading: boolean = false;
  submitting: boolean = false;
  error: string | null = null;
  isInitialized: boolean = false;

  // Estados de datos
  profesores: Profesor[] = [];
  hasActiveConvocatoria: boolean = false;
  lastCreatedConvocatoria: Convocatoria | null = null;

  // Estados específicos de carga
  loadingProfesores: boolean = false;
  checkingActiveConvocatoria: boolean = false;

  // Casos de uso
  private repository: ConvocatoriaRepository;
  private createConvocatoriaUseCase: CreateConvocatoriaUseCase;
  private getProfesoresUseCase: GetProfesoresUseCase;
  private checkActiveConvocatoriaUseCase: CheckActiveConvocatoriaUseCase;

  // Opciones de pasantías disponibles
  readonly opcionesPasantias: string[] = [
    "Estancia I", 
    "Estancia II", 
    "Estadía", 
    "Estadía 1", 
    "Estadía 2"
  ];

  constructor() {
    makeAutoObservable(this);

    this.repository = new ConvocatoriaRepository();
    this.createConvocatoriaUseCase = new CreateConvocatoriaUseCase(this.repository);
    this.getProfesoresUseCase = new GetProfesoresUseCase(this.repository);
    this.checkActiveConvocatoriaUseCase = new CheckActiveConvocatoriaUseCase(this.repository);
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

  setLoadingProfesores(loading: boolean) {
    this.loadingProfesores = loading;
  }

  setCheckingActiveConvocatoria(checking: boolean) {
    this.checkingActiveConvocatoria = checking;
  }

  setProfesores(profesores: Profesor[]) {
    this.profesores = profesores;
  }

  setHasActiveConvocatoria(hasActive: boolean) {
    this.hasActiveConvocatoria = hasActive;
  }

  setLastCreatedConvocatoria(convocatoria: Convocatoria | null) {
    this.lastCreatedConvocatoria = convocatoria;
  }

  // Método de inicialización
  async initialize(): Promise<void> {
    this.setLoading(true);
    this.setError(null);

    try {
      await Promise.all([
        this.checkActiveConvocatoria(),
        this.loadProfesores()
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

  // Cargar profesores disponibles
  async loadProfesores(): Promise<void> {
    this.setLoadingProfesores(true);
    this.setError(null);

    try {
      const profesores = await this.getProfesoresUseCase.execute();
      runInAction(() => {
        this.setProfesores(profesores);
      });
    } catch (error: any) {
      runInAction(() => {
        this.setProfesores([]);
        console.error("Error al cargar profesores:", error);
        // No setear error aquí ya que no debe bloquear el formulario completamente
      });
    } finally {
      this.setLoadingProfesores(false);
    }
  }

  // Verificar convocatoria activa
  async checkActiveConvocatoria(): Promise<void> {
    this.setCheckingActiveConvocatoria(true);

    try {
      const hasActive = await this.checkActiveConvocatoriaUseCase.execute();
      runInAction(() => {
        this.setHasActiveConvocatoria(hasActive);
      });
    } catch (error: any) {
      runInAction(() => {
        this.setHasActiveConvocatoria(false);
        console.error("Error al verificar convocatoria activa:", error);
      });
    } finally {
      this.setCheckingActiveConvocatoria(false);
    }
  }

  // Crear nueva convocatoria
  async createConvocatoria(params: CreateConvocatoriaParams): Promise<boolean> {
    this.setSubmitting(true);
    this.setError(null);

    try {
      const convocatoria = await this.createConvocatoriaUseCase.execute(params);
      
      runInAction(() => {
        this.setLastCreatedConvocatoria(convocatoria);
      });

      // Recargar datos después de crear la convocatoria
      await Promise.all([
        this.checkActiveConvocatoria(),
        this.loadProfesores()
      ]);

      return true;
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Error al crear la convocatoria");
      });
      return false;
    } finally {
      this.setSubmitting(false);
    }
  }

  // Validar si el formulario puede ser enviado
  canSubmitForm(): boolean {
    return !this.hasActiveConvocatoria && 
           this.profesores.length > 0 && 
           !this.loadingProfesores && 
           !this.checkingActiveConvocatoria &&
           !this.submitting;
  }

  // Validar si se pueden seleccionar más pasantías
  canSelectMorePasantias(currentCount: number): boolean {
    return currentCount < 5;
  }

  // 🚀 MODIFICADO: Obtener fecha mínima para el input date (mañana)
  getMinDate(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1); // Mínimo mañana
    
    const year = tomorrow.getFullYear();
    const month = (tomorrow.getMonth() + 1).toString().padStart(2, '0');
    const day = tomorrow.getDate().toString().padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }

  // Limpiar errores
  clearError() {
    this.setError(null);
  }

  // Resetear el ViewModel
  reset() {
    this.loading = false;
    this.submitting = false;
    this.error = null;
    this.isInitialized = false;
    this.profesores = [];
    this.hasActiveConvocatoria = false;
    this.lastCreatedConvocatoria = null;
    this.loadingProfesores = false;
    this.checkingActiveConvocatoria = false;
  }
}