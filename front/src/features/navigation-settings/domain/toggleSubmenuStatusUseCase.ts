import { SubmenuRepository } from "../data/repository/SubmenuRepository";

export class ToggleSubmenuStatusUseCase {
    constructor(private repository: SubmenuRepository){}

    async execute(uuid: string, active: boolean): Promise<boolean> {
        return await this.repository.toggleSubmenuStatus(uuid, active);
    }
}