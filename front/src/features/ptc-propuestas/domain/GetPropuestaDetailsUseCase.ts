// src/features/ptc-propuestas/domain/GetPropuestaDetailsUseCase.ts
import { PTCPropuestaRepository } from "../data/repository/PTCPropuestaRepository";
import { Propuesta } from "../../alumnos-propuestas/data/models/Propuesta";

export class GetPropuestaDetailsUseCase {
  constructor(private repository: PTCPropuestaRepository) {}

  async execute(uuid: string): Promise<Propuesta | null> {
    try {
      return await this.repository.getPropuesta(uuid);
    } catch (error) {
      console.error("Error en GetPropuestaDetailsUseCase:", error);
      throw error;
    }
  }
}