import { ConvocatoriaRepository } from "../data/repository/ConvocatoriaRepository";
import { Convocatoria } from "../data/models/Convocatoria";

export class GetConvocatoriasUseCase {
  constructor(private repository: ConvocatoriaRepository) {}

  async execute(): Promise<Convocatoria[]> {
    try {
      const convocatorias = await this.repository.getConvocatorias();
      
      // Ordenar por fecha de creación (más recientes primero)
      return convocatorias.sort((a, b) => 
        new Date(b.getCreatedAt()).getTime() - new Date(a.getCreatedAt()).getTime()
      );
    } catch (error) {
      console.error("Error en GetConvocatoriasUseCase:", error);
      throw error;
    }
  }
}