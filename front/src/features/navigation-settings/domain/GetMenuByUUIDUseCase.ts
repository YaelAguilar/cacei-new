import { MenuRepository } from "../data/repository/MenuRepository";
import { Menu } from "../data/models/Menu";

export class GetMenuByUUID {
    constructor(private repository: MenuRepository) {}

    async execute(uuid: string): Promise<Menu | null> {
        try {
            const menu = await this.repository.getMenuByUUID(uuid);
            return menu;
        } catch (error) {
            console.error("Error fetching menu by UUID:", error);
            return null;
        }
    }
}