import { Menu } from "../data/models/Menu";
import { MenuRepository } from "../data/repository/MenuRepository";

export class GetAllMenusUseCase {
    constructor(private menuRepository: MenuRepository) {}

    async execute(): Promise<Menu[] | null> {
        return await this.menuRepository.getAll();
    }
}