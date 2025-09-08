import { SubMenuRepository } from "../domain/interfaces/subMenuRepository";

export class ToggleSubmenuStatusUseCase {
    constructor(private readonly submenuRepository: SubMenuRepository) {}
  
    async execute(uuid: string, active: boolean): Promise<boolean> {
      try {
        return await this.submenuRepository.toggleSubmenuStatus(uuid, active);
      } catch (error) {
        console.error("Error in toggleSubmenuStatusUseCase:", error);
        throw error;
      }
    }
  }