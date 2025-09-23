import { ConvocatoriaRepository } from "../data/repository/ConvocatoriaRepository";
import { CreateConvocatoriaRequest } from "../data/models/ConvocatoriaDTO";
import { Convocatoria } from "../data/models/Convocatoria";

export interface CreateConvocatoriaParams {
  nombre: string;
  descripcion?: string;
  fechaLimite: string;
  pasantiasSeleccionadas: string[];
}

export class CreateConvocatoriaUseCase {
  constructor(private repository: ConvocatoriaRepository) {}

  async execute(params: CreateConvocatoriaParams): Promise<Convocatoria> {
    this.validateParams(params);

    const hasActiveConvocatoria = await this.repository.checkActiveConvocatoria();
    if (hasActiveConvocatoria) {
      throw new Error("No se puede crear una nueva convocatoria mientras haya una convocatoria vigente");
    }

    // Verificar que hay profesores disponibles
    const profesores = await this.repository.getProfesoresDisponibles();
    if (profesores.length === 0) {
      throw new Error("No hay profesores disponibles para la convocatoria");
    }

    const fechaLimiteConTiempo = this.convertToEndOfDay(params.fechaLimite);

    // Crear la convocatoria
    const request: CreateConvocatoriaRequest = {
      nombre: params.nombre.trim(),
      descripcion: params.descripcion?.trim() || null,
      fechaLimite: fechaLimiteConTiempo,
      pasantiasSeleccionadas: params.pasantiasSeleccionadas
    };

    const convocatoria = await this.repository.createConvocatoria(request);
    
    if (!convocatoria) {
      throw new Error("Error al crear la convocatoria");
    }

    return convocatoria;
  }

  private convertToEndOfDay(fechaString: string): string {
    try {
      const fecha = new Date(fechaString + 'T00:00:00.000Z');

      fecha.setUTCHours(23, 59, 59, 999);

      return fecha.toISOString();
    } catch (error) {
      throw new Error("Formato de fecha inválido. Use YYYY-MM-DD");
    }
  }

  private validateParams(params: CreateConvocatoriaParams): void {
    // Validar nombre
    if (!params.nombre || params.nombre.trim() === "") {
      throw new Error("El nombre es obligatorio");
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

    // Validar que la fecha sea al menos mañana (24 horas en el futuro)
    const fechaLimite = new Date(params.fechaLimite + 'T23:59:59.999Z');
    const hoy = new Date();
    const manana = new Date(hoy.getTime() + 24 * 60 * 60 * 1000);
    const fechaLimiteSoloFecha = new Date(fechaLimite.getFullYear(), fechaLimite.getMonth(), fechaLimite.getDate());
    const mananaISoloFecha = new Date(manana.getFullYear(), manana.getMonth(), manana.getDate());

    if (fechaLimiteSoloFecha < mananaISoloFecha) {
      throw new Error("La fecha límite debe ser al menos mañana");
    }

    // Validar pasantías
    if (!params.pasantiasSeleccionadas || params.pasantiasSeleccionadas.length === 0) {
      throw new Error("Debe seleccionar al menos una pasantía");
    }

    if (params.pasantiasSeleccionadas.length > 5) {
      throw new Error("No se pueden seleccionar más de 5 pasantías");
    }

    // Validar que las pasantías sean válidas
    const opcionesValidas = ["Estancia I", "Estancia II", "Estadía", "Estadía 1", "Estadía 2"];
    const pasantiasInvalidas = params.pasantiasSeleccionadas.filter(
      pasantia => !opcionesValidas.includes(pasantia)
    );

    if (pasantiasInvalidas.length > 0) {
      throw new Error(`Pasantías inválidas: ${pasantiasInvalidas.join(", ")}`);
    }
  }
}