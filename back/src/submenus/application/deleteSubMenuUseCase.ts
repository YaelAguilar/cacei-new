import { SubMenuRepository } from '../domain/interfaces/subMenuRepository';
import { SubMenu } from '../domain/models/submenu';

export class DeleteSubMenuUseCase {
  constructor(private readonly submenuRepository: SubMenuRepository) {}

  async run(uuid: string): Promise<SubMenu | null> {
    try {
      return await this.submenuRepository.deleteSubMenu(uuid);
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
