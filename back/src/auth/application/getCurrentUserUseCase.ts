import { UserRepository } from "../../users/domain/interfaces/userRepository";
import { User } from "../../users/domain/models/user";

export class GetCurrentUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(uuid: string): Promise<User | null> {
    try {
      console.log('🔍 GetCurrentUserUseCase ejecutándose para UUID:', uuid);
      
      const user = await this.userRepository.getUser(uuid);
      
      if (!user) {
        console.log('❌ Usuario no encontrado para UUID:', uuid);
        return null;
      }

      console.log('✅ Usuario encontrado:', {
        id: user.getId(),
        uuid: user.getUuid(),
        name: user.getName(),
        email: user.getEmail()
      });

      return user;
    } catch (error) {
      console.error('❌ Error en GetCurrentUserUseCase:', error);
      throw error;
    }
  }
}

