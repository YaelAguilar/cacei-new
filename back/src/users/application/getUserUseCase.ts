import { User } from '../domain/models/user';
import { UserRepository } from '../domain/interfaces/userRepository';

export class GetUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async run(uuid: string): Promise<User | null> {
    try {
      return await this.userRepository.getUser(uuid);
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
