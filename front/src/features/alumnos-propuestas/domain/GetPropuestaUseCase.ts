// src/features/alumnos-propuestas/domain/GetPropuestaUseCase.ts
import { PropuestaRepository } from "../data/repository/PropuestaRepository";
import { PropuestaCompleta } from "../data/models/Propuesta";

export class GetPropuestaUseCase {
  constructor(private repository: PropuestaRepository) {}

  async execute(uuid: string): Promise<PropuestaCompleta | null> {
    try {
      if (!uuid || uuid.trim() === '') {
        throw new Error('El UUID de la propuesta es obligatorio');
      }

      return await this.repository.getPropuesta(uuid.trim());
    } catch (error) {
      console.error("Error en GetPropuestaUseCase:", error);
      throw error;
    }
  }
}