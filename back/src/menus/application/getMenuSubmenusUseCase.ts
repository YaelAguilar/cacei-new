// src/Menu/application/getMenuSubmenusUseCase.ts
import { SubMenuRef } from "../domain/models/subMenuRef";
import { MenuRepository } from "../domain/interfaces/menuRepository";

export class GetMenuSubmenusUseCase {
    constructor(private readonly menuRepository: MenuRepository) { }

    async execute(menuUuid: string): Promise<SubMenuRef[]> {
        try {
            return await this.menuRepository.getSubmenus(menuUuid);
        } catch (error) {
            console.error("Error in GetMenuSubmenusUseCase:", error);
            throw error;
        }
    }
}