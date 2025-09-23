import { ConvocatoriaRepository } from "../data/repository/ConvocatoriaRepository";
import { CreateConvocatoriaRequest } from "../data/models/ConvocatoriaDTO";
import { Convocatoria } from "../data/models/Convocatoria";

export interface CreateConvocatoriaParams {
  nombre: string;
  descripcion?: string;
  fechaLimite: string; // Formato YYYY-MM-DD
  pasantiasSeleccionadas: string[];
}

export class CreateConvocatoriaUseCase {
  constructor(private repository: ConvocatoriaRepository) {}

  async execute(params: CreateConvocatoriaParams): Promise<Convocatoria> {
    // Validar parámetros de entrada
    this.validateParams(params);

    // Verificar que no existe una convocatoria activa
    const hasActiveConvocatoria = await this.repository.checkActiveConvocatoria();
    if (hasActiveConvocatoria) {
      throw new Error("No se puede crear una nueva convocatoria mientras haya una convocatoria vigente");
    }

    // Verificar que hay profesores disponibles
    const profesores = await this.repository.getProfesoresDisponibles();
    if (profesores.length === 0) {
      throw new Error("No hay profesores disponibles para la convocatoria");
    }

    // Construir la solicitud para el repositorio
    const request: CreateConvocatoriaRequest = {
      nombre: params.nombre.trim(),
      descripcion: params.descripcion?.trim() || null,
      fechaLimite: params.fechaLimite, // El backend se encarga de convertir a 23:59:59
      pasantiasSeleccionadas: params.pasantiasSeleccionadas
    };

    // Crear la convocatoria
    const convocatoria = await this.repository.createConvocatoria(request);
    
    if (!convocatoria) {
      throw new Error("Error al crear la convocatoria");
    }

    return convocatoria;
  }

  /**
   * Valida todos los parámetros de entrada para crear una convocatoria
   */
  private validateParams(params: CreateConvocatoriaParams): void {
    // Validar nombre
    if (!params.nombre || params.nombre.trim() === "") {
      throw new Error("El nombre es obligatorio");
    }

    if (params.nombre.trim().length < 3) {
      throw new Error("El nombre debe tener al menos 3 caracteres");
    }

    if (params.nombre.trim().length > 255) {
      throw new Error("El nombre no puede exceder 255 caracteres");
    }

    // Validar descripción (opcional pero con límite)
    if (params.descripcion && params.descripcion.trim().length > 1000) {
      throw new Error("La descripción no puede exceder 1000 caracteres");
    }

    // Validar fecha límite
    if (!params.fechaLimite) {
      throw new Error("La fecha límite es obligatoria");
    }

    // Validar formato de fecha (YYYY-MM-DD)
    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaRegex.test(params.fechaLimite)) {
      throw new Error("La fecha debe tener el formato YYYY-MM-DD");
    }

    // Validar que la fecha sea válida
    const fechaLimite = new Date(params.fechaLimite);
    if (isNaN(fechaLimite.getTime())) {
      throw new Error("La fecha proporcionada no es válida");
    }

    // Validar que la fecha sea al menos mañana (24 horas en el futuro)
    const hoy = new Date();
    const manana = new Date(hoy.getTime() + 24 * 60 * 60 * 1000);
    
    // Comparar solo las fechas (sin hora)
    const fechaLimiteSoloFecha = new Date(fechaLimite.getFullYear(), fechaLimite.getMonth(), fechaLimite.getDate());
    const mananaISoloFecha = new Date(manana.getFullYear(), manana.getMonth(), manana.getDate());

    if (fechaLimiteSoloFecha < mananaISoloFecha) {
      throw new Error("La fecha límite debe ser al menos mañana");
    }

    // Validar que la fecha no sea más de 1 año en el futuro
    const unAnoEnElFuturo = new Date(hoy.getFullYear() + 1, hoy.getMonth(), hoy.getDate());
    if (fechaLimiteSoloFecha > unAnoEnElFuturo) {
      throw new Error("La fecha límite no puede ser más de 1 año en el futuro");
    }

    // Validar pasantías seleccionadas
    if (!params.pasantiasSeleccionadas || !Array.isArray(params.pasantiasSeleccionadas)) {
      throw new Error("Las pasantías seleccionadas deben ser un arreglo");
    }

    if (params.pasantiasSeleccionadas.length === 0) {
      throw new Error("Debe seleccionar al menos una pasantía");
    }

    if (params.pasantiasSeleccionadas.length > 5) {
      throw new Error("No se pueden seleccionar más de 5 pasantías");
    }

    // Validar que todas las pasantías sean válidas
    const opcionesValidas = ["Estancia I", "Estancia II", "Estadía", "Estadía 1", "Estadía 2"];
    const pasantiasInvalidas = params.pasantiasSeleccionadas.filter(
      pasantia => !opcionesValidas.includes(pasantia)
    );

    if (pasantiasInvalidas.length > 0) {
      throw new Error(`Pasantías inválidas: ${pasantiasInvalidas.join(", ")}`);
    }

    // Validar que no haya duplicados
    const pasantiasUnicas = [...new Set(params.pasantiasSeleccionadas)];
    if (pasantiasUnicas.length !== params.pasantiasSeleccionadas.length) {
      throw new Error("No se pueden seleccionar pasantías duplicadas");
    }

    // Validar tipos de datos
    for (const pasantia of params.pasantiasSeleccionadas) {
      if (typeof pasantia !== 'string') {
        throw new Error("Todas las pasantías deben ser texto válido");
      }
    }
  }

  /**
   * Obtiene las opciones válidas de pasantías
   */
  static getValidPasantiasOptions(): string[] {
    return ["Estancia I", "Estancia II", "Estadía", "Estadía 1", "Estadía 2"];
  }

  /**
   * Valida si una pasantía específica es válida
   */
  static isValidPasantia(pasantia: string): boolean {
    return this.getValidPasantiasOptions().includes(pasantia);
  }
}