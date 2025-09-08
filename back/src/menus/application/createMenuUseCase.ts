import { MenuRepository } from "../domain/interfaces/menuRepository";
import { Menu } from "../domain/models/menu";

export class CreateMenuUseCase {
  constructor(private readonly menuRepository: MenuRepository) {}

  async run(
    name: string,
    description: string,
    icon: string,
    path: string,
    order: number,
    is_navegable: boolean,
    component_name: string,
    feature_name: string,
  ): Promise<Menu | null> {
    try {
      return await this.menuRepository.createMenu(
        name,
        description,
        icon,
        path,
        order,
        is_navegable, 
        component_name, 
        feature_name
      );
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
