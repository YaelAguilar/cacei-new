import { Menu } from '../domain/models/menu';
import { MenuRepository } from '../domain/interfaces/menuRepository';

export class UpdateMenuUseCase {
  constructor(private readonly userRepository: MenuRepository) {}

  async run(
    uuid: string,
    name: string,
    description: string,
    icon: string,
    path: string,
    orden: number,
    active: boolean,
    is_navegable: boolean,
    component_name: string,
    feature_name: string,
  ): Promise<Menu | null> {
    try {
      const newMenu = new Menu(uuid, name, description, icon, path, orden, active, is_navegable, component_name, feature_name);
      return this.userRepository.updateMenu(uuid, newMenu);
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
