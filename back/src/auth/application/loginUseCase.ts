import { AuthRepository } from "../domain/interfaces/authRepository";
import { User } from "../domain/models/user";

export class LoginUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async run(email: string, password: string): Promise<User | null> {
    // El repositorio se encarga de buscar el usuario y validar el password
    return await this.authRepository.login(email, password);
  }
}