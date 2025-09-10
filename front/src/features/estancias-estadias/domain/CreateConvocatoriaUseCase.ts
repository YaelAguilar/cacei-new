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
    // Validaciones de negocio
    this.validateParams(params);

    // Verificar que no hay convocatoria activa
    const hasActiveConvocatoria = await this.repository.checkActiveConvocatoria();
    if (hasActiveConvocatoria) {
      throw new Error("No se puede crear una nueva convocatoria mientras haya una convocatoria vigente");
    }

    // Verificar que hay profesores disponibles
    const profesores = await this.repository.getProfesoresDisponibles();
    if (profesores.length === 0) {
      throw new Error("No hay profesores disponibles para la convocatoria");
    }

    // Crear la convocatoria
    const request: CreateConvocatoriaRequest = {
      nombre: params.nombre.trim(),
      descripcion: params.descripcion?.trim() || null,
      fechaLimite: params.fechaLimite,
      pasantiasSeleccionadas: params.pasantiasSeleccionadas
    };

    const convocatoria = await this.repository.createConvocatoria(request);
    
    if (!convocatoria) {
      throw new Error("Error al crear la convocatoria");
    }

    return convocatoria;
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

    const fechaLimite = new Date(params.fechaLimite);
    const now = new Date();
    const minDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 horas

    if (fechaLimite <= minDate) {
      throw new Error("La fecha límite debe ser al menos 24 horas en el futuro");
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