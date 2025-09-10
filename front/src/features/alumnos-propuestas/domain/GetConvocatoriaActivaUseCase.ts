// src/features/alumnos-propuestas/domain/GetConvocatoriaActivaUseCase.ts
import { PropuestaRepository } from "../data/repository/PropuestaRepository";
import { ConvocatoriaActiva } from "../data/models/Propuesta";

export class GetConvocatoriaActivaUseCase {
  constructor(private repository: PropuestaRepository) {}

  async execute(): Promise<ConvocatoriaActiva | null> {
    try {
      return await this.repository.getConvocatoriaActiva();
    } catch (error) {
      console.error("Error en GetConvocatoriaActivaUseCase:", error);
      throw error;
    }
  }
}