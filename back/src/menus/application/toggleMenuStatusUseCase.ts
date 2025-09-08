import { MenuRepository } from "../domain/interfaces/menuRepository";

export class ToggleMenuStatusUseCase {
    constructor(private readonly menuRepository: MenuRepository) {}
  
    async execute(uuid: string, active: boolean): Promise<boolean> {
      try {
        return await this.menuRepository.toggleMenuStatus(uuid, active);
      } catch (error) {
        console.error("Error in toggleMenuStatusUseCase:", error);
        throw error;
      }
    }
  }