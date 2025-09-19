// src/features/alumnos-propuestas/domain/GetPropuestasByAlumnoUseCase.ts
import { PropuestaRepository } from "../data/repository/PropuestaRepository";
import { PropuestaCompleta } from "../data/models/Propuesta";

export class GetPropuestasByAlumnoUseCase {
  constructor(private repository: PropuestaRepository) {}

  async execute(): Promise<PropuestaCompleta[]> {
    try {
      return await this.repository.getPropuestasByAlumno();
    } catch (error) {
      console.error("Error en GetPropuestasByAlumnoUseCase:", error);
      throw error;
    }
  }
}