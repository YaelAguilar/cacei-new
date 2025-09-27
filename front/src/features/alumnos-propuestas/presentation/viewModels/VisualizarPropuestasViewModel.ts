// src/features/alumnos-propuestas/presentation/viewModels/VisualizarPropuestasViewModel.ts
import { makeAutoObservable, runInAction } from "mobx";
import { PropuestaRepository } from "../../data/repository/PropuestaRepository";
import { GetPropuestasByAlumnoUseCase } from "../../domain/GetPropuestasByAlumnoUseCase";
import { PropuestaCompleta, ProposalStatus } from "../../data/models/Propuesta";
import { PropuestaDetailViewModelInterface } from "../interfaces/PropuestaDetailViewModelInterface";

export class VisualizarPropuestasViewModel implements PropuestaDetailViewModelInterface {
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

  // Cargar propuestas por estatus
  async loadPropuestasByStatus(status: ProposalStatus): Promise<void> {
    this.setLoading(true);
    this.setError(null);

    try {
      const propuestas = await this.repository.getPropuestasByStatus(status);
      runInAction(() => {
        this.setPropuestas(propuestas);
      });
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Error al cargar las propuestas por estatus");
        this.setPropuestas([]);
      });
    } finally {
      this.setLoading(false);
    }
  }

  // Actualizar estatus de propuesta
  async updateProposalStatus(uuid: string, status: ProposalStatus): Promise<boolean> {
    try {
      const updatedPropuesta = await this.repository.updateProposalStatus(uuid, status);
      
      if (updatedPropuesta) {
        runInAction(() => {
          // Actualizar la propuesta en la lista
          const index = this.propuestas.findIndex(p => p.getId() === uuid);
          if (index !== -1) {
            this.propuestas[index] = updatedPropuesta;
          }
          
          // Actualizar la propuesta seleccionada si es la misma
          if (this.selectedPropuesta && this.selectedPropuesta.getId() === uuid) {
            this.selectedPropuesta = updatedPropuesta;
          }
        });
        return true;
      }
      return false;
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Error al actualizar el estatus de la propuesta");
      });
      return false;
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

  // Nuevos getters para propuestas por estatus
  get propuestasPendientes(): PropuestaCompleta[] {
    return this.propuestas.filter(propuesta => propuesta.getEstatus() === 'PENDIENTE');
  }

  get propuestasAprobadas(): PropuestaCompleta[] {
    return this.propuestas.filter(propuesta => propuesta.getEstatus() === 'APROBADO');
  }

  get propuestasRechazadas(): PropuestaCompleta[] {
    return this.propuestas.filter(propuesta => propuesta.getEstatus() === 'RECHAZADO');
  }

  get propuestasParaActualizar(): PropuestaCompleta[] {
    return this.propuestas.filter(propuesta => propuesta.getEstatus() === 'ACTUALIZAR');
  }

  // Estadísticas de propuestas
  get statistics() {
    return {
      total: this.propuestas.length,
      pendientes: this.propuestasPendientes.length,
      aprobadas: this.propuestasAprobadas.length,
      rechazadas: this.propuestasRechazadas.length,
      paraActualizar: this.propuestasParaActualizar.length,
      activas: this.propuestasActivas.length,
      inactivas: this.propuestasInactivas.length
    };
  }

  // Obtener el estado de una propuesta
  getPropuestaStatus(propuesta: PropuestaCompleta): {
    status: 'active' | 'inactive';
    label: string;
    color: string;
  } {
    // Primero verificar el estatus de la propuesta
    const statusInfo = propuesta.getStatusInfo();
    
    if (!propuesta.isActive()) {
      return {
        status: 'inactive',
        label: 'Inactiva',
        color: 'text-gray-600 bg-gray-100 border-gray-300'
      };
    }

    // Si está activa, mostrar el estatus actual
    return {
      status: 'active',
      label: statusInfo.label,
      color: `${statusInfo.color} ${statusInfo.bgColor}`
    };
  }

  // Obtener información detallada del estatus
  getPropuestaDetailedStatus(propuesta: PropuestaCompleta) {
    const statusInfo = propuesta.getStatusInfo();
    const activeInfo = propuesta.isActive();
    
    return {
      estatus: statusInfo,
      activa: activeInfo,
      mostrarEstatus: activeInfo, // Solo mostrar estatus si está activa
      colorPrincipal: activeInfo ? statusInfo.color : 'text-gray-600',
      fondoPrincipal: activeInfo ? statusInfo.bgColor : 'bg-gray-100 border-gray-300'
    };
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