// src/features/ptc-propuestas/presentation/viewModels/PTCPropuestasViewModel.ts
import { makeAutoObservable, runInAction } from "mobx";
import { PTCPropuestaRepository } from "../../data/repository/PTCPropuestaRepository";
import { GetAllPropuestasUseCase } from "../../domain/GetAllPropuestasUseCase";
import { GetPropuestaDetailsUseCase } from "../../domain/GetPropuestaDetailsUseCase";
import { PropuestaCompleta } from "../../../alumnos-propuestas/data/models/Propuesta";

export class PTCPropuestasViewModel {
  // Estados de UI
  loading: boolean = false;
  error: string | null = null;
  isInitialized: boolean = false;

  // Estados de datos
  propuestas: PropuestaCompleta[] = [];
  selectedPropuesta: PropuestaCompleta | null = null;
  showDetailModal: boolean = false;

  // Estados de filtros y búsqueda
  searchTerm: string = "";
  statusFilter: "all" | "active" | "inactive" = "all";
  tipoPasantiaFilter: string = "all";
  sortColumn: string = "createdAt";
  sortDirection: "asc" | "desc" = "desc";

  // Estados de paginación
  currentPage: number = 1;
  itemsPerPage: number = 10;

  // Casos de uso
  private repository: PTCPropuestaRepository;
  private getAllPropuestasUseCase: GetAllPropuestasUseCase;
  private getPropuestaDetailsUseCase: GetPropuestaDetailsUseCase;

  constructor() {
    makeAutoObservable(this);

    this.repository = new PTCPropuestaRepository();
    this.getAllPropuestasUseCase = new GetAllPropuestasUseCase(this.repository);
    this.getPropuestaDetailsUseCase = new GetPropuestaDetailsUseCase(this.repository);
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

  setSearchTerm(term: string) {
    this.searchTerm = term;
    this.currentPage = 1; // Reset a primera página al buscar
  }

  setStatusFilter(status: "all" | "active" | "inactive") {
    this.statusFilter = status;
    this.currentPage = 1; // Reset a primera página al filtrar
  }

  setTipoPasantiaFilter(tipo: string) {
    this.tipoPasantiaFilter = tipo;
    this.currentPage = 1; // Reset a primera página al filtrar
  }

  setSortColumn(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
    } else {
      this.sortColumn = column;
      this.sortDirection = "asc";
    }
  }

  setCurrentPage(page: number) {
    this.currentPage = page;
  }

  setItemsPerPage(itemsPerPage: number) {
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1; // Reset a primera página
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

  // Cargar todas las propuestas
  async loadPropuestas(): Promise<void> {
    this.setLoading(true);
    this.setError(null);

    try {
      const propuestas = await this.getAllPropuestasUseCase.execute();
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
  async openDetailModal(propuesta: PropuestaCompleta) {
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

  // Propuestas filtradas y buscadas
  get filteredPropuestas(): PropuestaCompleta[] {
    let filtered = [...this.propuestas];

    // Filtro por búsqueda
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(propuesta => 
        propuesta.getProyecto().getNombre().toLowerCase().includes(searchLower) ||
        propuesta.getEmpresa().getNombreCorto().toLowerCase().includes(searchLower) ||
        propuesta.getTutorAcademico().getNombre().toLowerCase().includes(searchLower) ||
        propuesta.getTipoPasantia().toLowerCase().includes(searchLower)
      );
    }

    // Filtro por status
    if (this.statusFilter !== "all") {
      filtered = filtered.filter(propuesta => {
        const isActive = propuesta.isActive();
        return this.statusFilter === "active" ? isActive : !isActive;
      });
    }

    // Filtro por tipo de pasantía
    if (this.tipoPasantiaFilter !== "all") {
      filtered = filtered.filter(propuesta => 
        propuesta.getTipoPasantia() === this.tipoPasantiaFilter
      );
    }

    // Ordenamiento
    filtered.sort((a, b) => {
      let valueA: any;
      let valueB: any;

      switch (this.sortColumn) {
        case "proyecto":
          valueA = a.getProyecto().getNombre();
          valueB = b.getProyecto().getNombre();
          break;
        case "empresa":
          valueA = a.getEmpresa().getNombreCorto();
          valueB = b.getEmpresa().getNombreCorto();
          break;
        case "tutor":
          valueA = a.getTutorAcademico().getNombre();
          valueB = b.getTutorAcademico().getNombre();
          break;
        case "tipoPasantia":
          valueA = a.getTipoPasantia();
          valueB = b.getTipoPasantia();
          break;
        case "fechaInicio":
          valueA = a.getProyecto().getFechaInicio().getTime();
          valueB = b.getProyecto().getFechaInicio().getTime();
          break;
        case "createdAt":
        default:
          valueA = a.getCreatedAt().getTime();
          valueB = b.getCreatedAt().getTime();
          break;
      }

      if (typeof valueA === "string") {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }

      if (valueA < valueB) return this.sortDirection === "asc" ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }

  // Propuestas paginadas
  get paginatedPropuestas(): PropuestaCompleta[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredPropuestas.slice(startIndex, endIndex);
  }

  // Información de paginación
  get paginationInfo() {
    const totalItems = this.filteredPropuestas.length;
    const totalPages = Math.ceil(totalItems / this.itemsPerPage);
    const startItem = (this.currentPage - 1) * this.itemsPerPage + 1;
    const endItem = Math.min(this.currentPage * this.itemsPerPage, totalItems);

    return {
      totalItems,
      totalPages,
      currentPage: this.currentPage,
      startItem,
      endItem,
      hasNextPage: this.currentPage < totalPages,
      hasPrevPage: this.currentPage > 1
    };
  }

  // Estadísticas rápidas
  get statistics() {
    const total = this.propuestas.length;
    const active = this.propuestas.filter(p => p.isActive()).length;
    const inactive = total - active;

    const tiposPasantia = this.propuestas.reduce((acc, propuesta) => {
      const tipo = propuesta.getTipoPasantia();
      acc[tipo] = (acc[tipo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      active,
      inactive,
      tiposPasantia
    };
  }

  // Obtener tipos de pasantía únicos para filtro
  get uniqueTiposPasantia(): string[] {
    const tipos = new Set(this.propuestas.map(p => p.getTipoPasantia()));
    return Array.from(tipos).sort();
  }

  // Formatear fecha para mostrar
  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
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

  // Limpiar errores
  clearError() {
    this.setError(null);
  }

  // Limpiar filtros
  clearFilters() {
    this.setSearchTerm("");
    this.setStatusFilter("all");
    this.setTipoPasantiaFilter("all");
    this.setCurrentPage(1);
  }

  // Resetear el ViewModel
  reset() {
    this.loading = false;
    this.error = null;
    this.isInitialized = false;
    this.propuestas = [];
    this.selectedPropuesta = null;
    this.showDetailModal = false;
    this.searchTerm = "";
    this.statusFilter = "all";
    this.tipoPasantiaFilter = "all";
    this.sortColumn = "createdAt";
    this.sortDirection = "desc";
    this.currentPage = 1;
    this.itemsPerPage = 10;
  }
}