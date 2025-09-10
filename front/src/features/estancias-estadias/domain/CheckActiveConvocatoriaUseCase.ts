import { ConvocatoriaRepository } from "../data/repository/ConvocatoriaRepository";

export class CheckActiveConvocatoriaUseCase {
  constructor(private repository: ConvocatoriaRepository) {}

  async execute(): Promise<boolean> {
    try {
      return await this.repository.checkActiveConvocatoria();
    } catch (error) {
      console.error("Error en CheckActiveConvocatoriaUseCase:", error);
      // En caso de error, asumimos que no hay convocatoria activa
      // para no bloquear la funcionalidad
      return false;
    }
  }
}