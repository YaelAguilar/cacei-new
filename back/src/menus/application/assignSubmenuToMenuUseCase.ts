import { MenuRepository } from "../domain/interfaces/menuRepository";

export class AssignSubmenuToMenuUseCase {
    constructor(private readonly menuRepository: MenuRepository) { }

    async execute(menuUuid: string, submenuUuid: string): Promise<boolean> {
        try {
            return await this.menuRepository.assignSubmenu(menuUuid, submenuUuid);
        } catch (error) {
            console.error("Error in AssignSubmenuToMenuUseCase:", error);
            throw error;
        }
    }
}