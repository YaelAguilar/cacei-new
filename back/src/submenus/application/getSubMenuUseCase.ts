import { SubMenu } from '../domain/models/submenu';
import { SubMenuRepository } from '../domain/interfaces/subMenuRepository';

export class GetSubMenuUseCase {
  constructor(private readonly submenuRepository: SubMenuRepository) {}

  async run(uuid: string): Promise<SubMenu | null> {
    try {
      return await this.submenuRepository.getSubMenu(uuid);
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
