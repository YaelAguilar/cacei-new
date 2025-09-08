import { SubMenuRepository } from "../domain/interfaces/subMenuRepository";
import { SubMenu } from "../domain/models/submenu";

export class CreateSubMenuUseCase {
  constructor(private readonly submenuRepository: SubMenuRepository) {}

  async run(
    name: string,
    description: string,
    component_name: string,
    path: string,
    sort_order: number, 
    uuid_menu: string
  ): Promise<SubMenu | null> {
    try {
      return await this.submenuRepository.createSubMenu(
        name,
        description,
        component_name,
        path,
        sort_order,
        uuid_menu
      );
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
