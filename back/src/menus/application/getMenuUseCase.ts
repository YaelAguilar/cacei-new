import { Menu } from '../domain/models/menu';
import { MenuRepository } from '../domain/interfaces/menuRepository';

export class GetMenuUseCase {
  constructor(private readonly menuRepository: MenuRepository) {}

  async run(uuid: string): Promise<Menu | null> {
    try {
      return await this.menuRepository.getMenu(uuid);
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
