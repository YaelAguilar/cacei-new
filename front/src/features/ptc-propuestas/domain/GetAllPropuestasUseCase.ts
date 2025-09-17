// src/features/ptc-propuestas/domain/GetAllPropuestasUseCase.ts
import { PTCPropuestaRepository } from "../data/repository/PTCPropuestaRepository";
import { Propuesta } from "../../alumnos-propuestas/data/models/Propuesta";

export class GetAllPropuestasUseCase {
  constructor(private repository: PTCPropuestaRepository) {}

  async execute(): Promise<Propuesta[]> {
    try {
      const propuestas = await this.repository.getAllPropuestas();
      
      // Ordenar por fecha de creación (más recientes primero)
      return propuestas.sort((a, b) => 
        new Date(b.getCreatedAt()).getTime() - new Date(a.getCreatedAt()).getTime()
      );
    } catch (error) {
      console.error("Error en GetAllPropuestasUseCase:", error);
      throw error;
    }
  }
}