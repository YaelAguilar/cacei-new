import { SubMenu } from '../domain/models/submenu';
import { SubMenuRepository } from '../domain/interfaces/subMenuRepository';

export class UpdateSubMenuUseCase {
  constructor(private readonly submenuRepository: SubMenuRepository) {}

  async run(
    uuid: string,
    name: string,
    description: string,
    component_name: string,
    path: string,
    sort_order: number
  ): Promise<SubMenu | null> {
    try {
      const newSubmenu = new SubMenu(uuid, name, description, "", path, sort_order, true, component_name);
      return this.submenuRepository.updateSubMenu(uuid, newSubmenu);
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
