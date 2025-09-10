// src/features/alumnos-propuestas/domain/GetPropuestasByAlumnoUseCase.ts
import { PropuestaRepository } from "../data/repository/PropuestaRepository";
import { Propuesta } from "../data/models/Propuesta";

export class GetPropuestasByAlumnoUseCase {
  constructor(private repository: PropuestaRepository) {}

  async execute(): Promise<Propuesta[]> {
    try {
      return await this.repository.getPropuestasByAlumno();
    } catch (error) {
      console.error("Error en GetPropuestasByAlumnoUseCase:", error);
      throw error;
    }
  }
}