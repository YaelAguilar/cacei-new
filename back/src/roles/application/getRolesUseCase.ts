import { RoleRepository } from "../domain/interfaces/roleRepository";
import { Role } from "../domain/models/role";
import { PaginationResponse } from "../../utils/paginationResponse";

export class GetRolesUseCase {
    constructor(private readonly roleRepository : RoleRepository){}

    async execute(
        fields: string[] | null = null, 
        page: number = 1, 
        limit: number = 10
    ): Promise<PaginationResponse<Role> | null>{
        try {
            const validPage = isNaN(page) || page < 1 ? 1 : page;
            const validLimit = isNaN(limit) || limit < 1 ? 10 : limit;

            const roles = await this.roleRepository.getRoles(fields, validPage, validLimit);

            return roles;

        } catch (error) {
            console.error('Get All Roles Error:', error);
            throw new Error('Error fetching roles');
        }
    }
}