import { makeAutoObservable, runInAction } from "mobx";
import { ConvocatoriaRepository } from "../../data/repository/ConvocatoriaRepository";
import { GetConvocatoriasUseCase } from "../../domain/GetConvocatoriasUseCase";
import { Convocatoria } from "../../data/models/Convocatoria";

export class VisualizarConvocatoriasViewModel {
  // Estados de UI
  loading: boolean = false;
  error: string | null = null;
  isInitialized: boolean = false;

  // Estados de datos
  convocatorias: Convocatoria[] = [];
  selectedConvocatoria: Convocatoria | null = null;
  showDetailModal: boolean = false;

  // Casos de uso
  private repository: ConvocatoriaRepository;
  private getConvocatoriasUseCase: GetConvocatoriasUseCase;

  constructor() {
    makeAutoObservable(this);

    this.repository = new ConvocatoriaRepository();
    this.getConvocatoriasUseCase = new GetConvocatoriasUseCase(this.repository);
  }

  // Setters para estados
  setLoading(loading: boolean) {
    this.loading = loading;
  }

  setError(error: string | null) {
    this.error = error;
  }

  setConvocatorias(convocatorias: Convocatoria[]) {
    this.convocatorias = convocatorias;
  }

  setSelectedConvocatoria(convocatoria: Convocatoria | null) {
    this.selectedConvocatoria = convocatoria;
  }

  setShowDetailModal(show: boolean) {
    this.showDetailModal = show;
  }

  // Método de inicialización
  async initialize(): Promise<void> {
    this.setLoading(true);
    this.setError(null);

    try {
      await this.loadConvocatorias();
    } catch (error: any) {
      this.setError(error.message || "Error al cargar las convocatorias");
    } finally {
      runInAction(() => {
        this.isInitialized = true;
        this.setLoading(false);
      });
    }
  }

  // Cargar convocatorias
  async loadConvocatorias(): Promise<void> {
    this.setLoading(true);
    this.setError(null);

    try {
      const convocatorias = await this.getConvocatoriasUseCase.execute();
      runInAction(() => {
        this.setConvocatorias(convocatorias);
      });
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Error al cargar las convocatorias");
        this.setConvocatorias([]);
      });
    } finally {
      this.setLoading(false);
    }
  }

  // Abrir modal de detalles
  openDetailModal(convocatoria: Convocatoria) {
    this.setSelectedConvocatoria(convocatoria);
    this.setShowDetailModal(true);
  }

  // Cerrar modal de detalles
  closeDetailModal() {
    this.setShowDetailModal(false);
    this.setSelectedConvocatoria(null);
  }

  // Obtener convocatorias activas
  get convocatoriasActivas(): Convocatoria[] {
    return this.convocatorias.filter(conv => conv.isActive());
  }

  // Obtener convocatorias inactivas
  get convocatoriasInactivas(): Convocatoria[] {
    return this.convocatorias.filter(conv => !conv.isActive());
  }

  // Verificar si hay convocatorias
  get hasConvocatorias(): boolean {
    return this.convocatorias.length > 0;
  }

  // Verificar si una convocatoria ha expirado
  isConvocatoriaExpired(convocatoria: Convocatoria): boolean {
    return new Date() > convocatoria.getFechaLimite();
  }

  // Obtener el estado de una convocatoria
  getConvocatoriaStatus(convocatoria: Convocatoria): {
    status: 'active' | 'expired' | 'inactive';
    label: string;
    color: string;
  } {
    if (!convocatoria.isActive()) {
      return {
        status: 'inactive',
        label: 'Inactiva',
        color: 'text-gray-500 bg-gray-100 border-gray-300'
      };
    }

    if (this.isConvocatoriaExpired(convocatoria)) {
      return {
        status: 'expired',
        label: 'Expirada',
        color: 'text-red-600 bg-red-100 border-red-300'
      };
    }

    return {
      status: 'active',
      label: 'Activa',
      color: 'text-green-600 bg-green-100 border-green-300'
    };
  }

  // Formatear fecha para mostrar
  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  // Calcular días restantes
  getDaysRemaining(convocatoria: Convocatoria): number | null {
    if (!convocatoria.isActive()) return null;
    
    const now = new Date();
    const fechaLimite = convocatoria.getFechaLimite();
    const diffTime = fechaLimite.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
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
    this.convocatorias = [];
    this.selectedConvocatoria = null;
    this.showDetailModal = false;
  }
}