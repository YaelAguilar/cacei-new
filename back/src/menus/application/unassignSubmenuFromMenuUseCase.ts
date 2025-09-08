import { MenuRepository } from "../domain/interfaces/menuRepository";

export class UnassignSubmenuFromMenuUseCase {
    constructor(private readonly menuRepository: MenuRepository) { }

    async execute(menuUuid: string, submenuUuid: string): Promise<boolean> {
        try {
            return await this.menuRepository.unassignSubmenu(menuUuid, submenuUuid);
        } catch (error) {
            console.error("Error in UnassignSubmenuFromMenuUseCase:", error);
            throw error;
        }
    }
}