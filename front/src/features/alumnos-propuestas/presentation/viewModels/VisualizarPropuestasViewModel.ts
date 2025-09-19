// src/features/alumnos-propuestas/presentation/viewModels/VisualizarPropuestasViewModel.ts
import { makeAutoObservable, runInAction } from "mobx";
import { PropuestaRepository } from "../../data/repository/PropuestaRepository";
import { GetPropuestasByAlumnoUseCase } from "../../domain/GetPropuestasByAlumnoUseCase";
import { PropuestaCompleta } from "../../data/models/Propuesta";

export class VisualizarPropuestasViewModel {
  // Estados de UI
  loading: boolean = false;
  error: string | null = null;
  isInitialized: boolean = false;

  // Estados de datos
  propuestas: PropuestaCompleta[] = [];
  selectedPropuesta: PropuestaCompleta | null = null;
  showDetailModal: boolean = false;

  // Casos de uso
  private repository: PropuestaRepository;
  private getPropuestasByAlumnoUseCase: GetPropuestasByAlumnoUseCase;

  constructor() {
    makeAutoObservable(this);

    this.repository = new PropuestaRepository();
    this.getPropuestasByAlumnoUseCase = new GetPropuestasByAlumnoUseCase(this.repository);
  }

  // Setters para estados
  setLoading(loading: boolean) {
    this.loading = loading;
  }

  setError(error: string | null) {
    this.error = error;
  }

  setPropuestas(propuestas: PropuestaCompleta[]) {
    this.propuestas = propuestas;
  }

  setSelectedPropuesta(propuesta: PropuestaCompleta | null) {
    this.selectedPropuesta = propuesta;
  }

  setShowDetailModal(show: boolean) {
    this.showDetailModal = show;
  }

  // Método de inicialización
  async initialize(): Promise<void> {
    this.setLoading(true);
    this.setError(null);

    try {
      await this.loadPropuestas();
    } catch (error: any) {
      this.setError(error.message || "Error al cargar las propuestas");
    } finally {
      runInAction(() => {
        this.isInitialized = true;
        this.setLoading(false);
      });
    }
  }

  // Cargar propuestas del alumno
  async loadPropuestas(): Promise<void> {
    this.setLoading(true);
    this.setError(null);

    try {
      const propuestas = await this.getPropuestasByAlumnoUseCase.execute();
      runInAction(() => {
        this.setPropuestas(propuestas);
      });
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Error al cargar las propuestas");
        this.setPropuestas([]);
      });
    } finally {
      this.setLoading(false);
    }
  }

  // Abrir modal de detalles
  openDetailModal(propuesta: PropuestaCompleta) {
    this.setSelectedPropuesta(propuesta);
    this.setShowDetailModal(true);
  }

  // Cerrar modal de detalles
  closeDetailModal() {
    this.setShowDetailModal(false);
    this.setSelectedPropuesta(null);
  }

  // Getters calculados
  get hasPropuestas(): boolean {
    return this.propuestas.length > 0;
  }

  get propuestasActivas(): PropuestaCompleta[] {
    return this.propuestas.filter(propuesta => propuesta.isActive());
  }

  get propuestasInactivas(): PropuestaCompleta[] {
    return this.propuestas.filter(propuesta => !propuesta.isActive());
  }

  // Obtener el estado de una propuesta
  getPropuestaStatus(propuesta: PropuestaCompleta): {
    status: 'active' | 'inactive';
    label: string;
    color: string;
  } {
    if (propuesta.isActive()) {
      return {
        status: 'active',
        label: 'Activa',
        color: 'text-green-600 bg-green-100 border-green-300'
      };
    } else {
      return {
        status: 'inactive',
        label: 'Inactiva',
        color: 'text-gray-600 bg-gray-100 border-gray-300'
      };
    }
  }

  // Formatear fecha para mostrar
  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  }

  // Formatear fecha completa
  formatDateTime(date: Date): string {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  // Limpiar errores
  clearError() {
    this.setError(null);
  }

  // Resetear el ViewModel
  reset() {
    this.loading = false;
    this.error = null;
    this.isInitialized = false;
    this.propuestas = [];
    this.selectedPropuesta = null;
    this.showDetailModal = false;
  }
}