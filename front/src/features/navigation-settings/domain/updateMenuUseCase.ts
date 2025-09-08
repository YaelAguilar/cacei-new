import { MenuRepository } from "../data/repository/MenuRepository";
import { Menu } from "../data/models/Menu";

export class UpdateMenuUseCase {
    constructor(private repository: MenuRepository) {}
  
    async execute(
      uuid: string, 
      menuData: Partial<{
        name: string,
        description: string,
        icon: string,
        path: string,
        order: number,
        is_navegable: boolean,
        component_name: string | null, // Puede ser null si no es navegable
        feature_name: string,
      }>
    ): Promise<Menu | null> {  
      return await this.repository.updateMenu(uuid, menuData);
    }
  }