import { MenuRepository } from '../domain/interfaces/menuRepository';
import { Menu } from '../domain/models/menu';

export class DeleteMenuUseCase {
  constructor(private readonly userRepository: MenuRepository) {}

  async run(uuid: string): Promise<Menu | null> {
    try {
      return await this.userRepository.deleteMenu(uuid);
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
