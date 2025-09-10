import { ConvocatoriaRepository } from "../data/repository/ConvocatoriaRepository";
import { UpdateConvocatoriaRequest } from "../data/models/ConvocatoriaDTO";
import { Convocatoria } from "../data/models/Convocatoria";

export interface UpdateConvocatoriaParams {
  uuid: string;
  nombre: string;
  descripcion?: string;
  fechaLimite: string;
  pasantiasSeleccionadas: string[];
  actualizarProfesores: boolean;
}

export class UpdateConvocatoriaUseCase {
  constructor(private repository: ConvocatoriaRepository) {}

  async execute(params: UpdateConvocatoriaParams): Promise<Convocatoria> {
    // Validaciones de negocio similares a la creación
    if (!params.nombre || params.nombre.trim() === "") {
      throw new Error("El nombre es obligatorio");
    }

    const fechaLimite = new Date(params.fechaLimite);
    const now = new Date();
    const minDate = new Date(now.getTime() + 60 * 60 * 1000); // 1 hora en el futuro

    if (fechaLimite <= minDate) {
      throw new Error("La fecha límite debe ser al menos 1 hora en el futuro");
    }

    if (!params.pasantiasSeleccionadas || params.pasantiasSeleccionadas.length === 0) {
      throw new Error("Debe seleccionar al menos una pasantía");
    }

    // Construir la solicitud
    const request: UpdateConvocatoriaRequest = {
      nombre: params.nombre.trim(),
      descripcion: params.descripcion?.trim() || null,
      fechaLimite: params.fechaLimite,
      pasantiasSeleccionadas: params.pasantiasSeleccionadas,
      actualizarProfesores: params.actualizarProfesores,
    };

    const convocatoria = await this.repository.updateConvocatoria(params.uuid, request);
    
    if (!convocatoria) {
      throw new Error("Error al actualizar la convocatoria. Es posible que ya no esté activa.");
    }

    return convocatoria;
  }
}