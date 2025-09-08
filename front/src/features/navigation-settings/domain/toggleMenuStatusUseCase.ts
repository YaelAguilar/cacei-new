import { MenuRepository } from "../data/repository/MenuRepository";

export class ToggleMenuStatusUseCase {
    constructor(private repository: MenuRepository) {}
  
    async execute(uuid: string, active: boolean): Promise<boolean> {
      return await this.repository.toggleMenuStatus(uuid, active);
    }
  }