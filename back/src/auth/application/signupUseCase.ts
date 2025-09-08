import { AuthRepository } from "../domain/interfaces/authRepository";
import { User } from "../domain/models/user";

export class SignupUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async run(
    name: string,
    lastName: string,
    secondLastName: string,
    email: string,
    phone: string,
    password: string
  ): Promise<User | null> {
    try {
      return await this.authRepository.signup(name, lastName, secondLastName, email, phone, password);
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}