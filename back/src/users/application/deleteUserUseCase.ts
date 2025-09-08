import { UserRepository } from '../domain/interfaces/userRepository';
import { User } from '../domain/models/user';

export class DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async run(uuid: string): Promise<User | null> {
    try {
      return await this.userRepository.deleteUser(uuid);
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
