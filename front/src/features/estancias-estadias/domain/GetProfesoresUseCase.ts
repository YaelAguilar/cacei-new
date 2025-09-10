import { ConvocatoriaRepository } from "../data/repository/ConvocatoriaRepository";
import { Profesor } from "../data/models/Convocatoria";

export class GetProfesoresUseCase {
  constructor(private repository: ConvocatoriaRepository) {}

  async execute(): Promise<Profesor[]> {
    try {
      const profesores = await this.repository.getProfesoresDisponibles();
      
      if (profesores.length === 0) {
        throw new Error("No hay profesores disponibles para crear una convocatoria");
      }

      return profesores;
    } catch (error) {
      console.error("Error en GetProfesoresUseCase:", error);
      throw error;
    }
  }
}