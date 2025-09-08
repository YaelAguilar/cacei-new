import { Submenu } from "../data/models/Submenu";
import { SubmenuRepository } from "../data/repository/SubmenuRepository";

export class CreateSubmenuUseCase {
    private respository: SubmenuRepository;

    constructor(repository: SubmenuRepository) {
        this.respository = repository;
    }

    async execute(
        name: string,
        description: string,
        component_name: string,
        path: string,
        order: number,
        id_menu: string
    ): Promise<Submenu | null> {
        const submenu = new Submenu("", id_menu, name, description, "", path, order, true, component_name);
        return this.respository.create(submenu);
    }
}