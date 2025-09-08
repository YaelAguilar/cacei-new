import { SubmenuRepository } from "../data/repository/SubmenuRepository";
import { Submenu } from "../data/models/Submenu";

export class UpdateSubmenuUseCase {
    constructor(private repository: SubmenuRepository){}

    async execute(
        uuid: string, 
        submenuData: Partial<{
            name: string,
            description: string,
            component_name: string,
            path: string,
            sort_order: number,
            id_menu: string
        }>
    ): Promise<Submenu | null> {
        return await this.repository.updateSubmenu(uuid, submenuData);
    }
}