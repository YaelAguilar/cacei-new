import { MenuWithSubmenus } from "../domain/models/menuWithSubmenus";
import { MenuRepository } from "../domain/interfaces/menuRepository";

export class GetAllMenusWithSubmenusUseCase {
    constructor(private readonly menuRepository: MenuRepository) { }

    async execute(): Promise<MenuWithSubmenus[]> {
        try {
            return await this.menuRepository.getAllWithSubmenus();
        } catch (error) {
            console.error("Error in GetAllMenusWithSubmenusUseCase:", error);
            throw error;
        }
    }
}