import { User } from '../domain/models/user';
import { UserRepository } from '../domain/interfaces/userRepository';

export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async run(
    uuid: string,
    name: string,
    lastName: string,
    secondLastName: string,
    email: string,
    phone: string,
    password: string
  ): Promise<User | null> {
    try {
      const newUser = new User(uuid, name, lastName, secondLastName, email, phone, password);
      return this.userRepository.updateUser(uuid, newUser);
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
