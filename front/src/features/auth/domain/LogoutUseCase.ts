import { AuthRepository } from "../data/repository/authRepository";

/**
 * Caso de uso para realizar el logout de usuario
 */
export class LogoutUseCase {
  constructor(private repository: AuthRepository) {}

  /**
   * Ejecuta el caso de uso de logout
   * @returns true si el logout fue exitoso
   */
  async execute(): Promise<boolean> {
    try {
      const result = await this.repository.logout();
      return result;
    } catch (error) {
      console.error("Error en LogoutUseCase:", error);
      return true; // Consideramos exitoso para limpiar estado local
    }
  }
}