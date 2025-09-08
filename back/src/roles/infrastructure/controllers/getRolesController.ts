import { Request, Response } from 'express';
import { GetRolesUseCase } from "../../application/getRolesUseCase";

export class GetRolesController {
    constructor(private readonly rolesUseCase: GetRolesUseCase) {}

    run = async (req: Request, res: Response): Promise<void> => {
        try {
            const { page = 1, limit = 10, fields } = req.query;
            const fieldsArray = fields ? (fields as string).split(',') : null;
            const rolesResponse = await this.rolesUseCase.execute(
                fieldsArray,
                parseInt(page as string),
                parseInt(limit as string)
            );

            if (!rolesResponse) {
                throw new Error("Failed to retrieve roles");
            }

            // Transformamos los roles al formato JSON:API
            const formattedRoles = rolesResponse.data.map(role => ({
                type: "role",
                id: role.getUuid(),  // Usamos UUID como ID en la respuesta
                attributes: {
                    name: role.getName(),
                    description: role.getDescription()
                },
                meta: {
                    menuCount: (role as any).menuCount || 0,
                    submenuCount: (role as any).submenuCount || 0,
                    userCount: (role as any).userCount || 0 
                }
            }));

            // Respuesta en formato JSON:API
            res.status(200).json({
                data: formattedRoles,
                meta: {
                    pagination: {
                        currentPage: rolesResponse.pagination.currentPage,
                        limit: rolesResponse.pagination.limit,
                        total: rolesResponse.pagination.total
                    }
                }
            });
        } catch (error) {
            console.error("Error getting roles:", error);
            res.status(500).json({ 
                errors: [{
                    status: "500",
                    title: "Error retrieving Roles",
                    detail: error instanceof Error ? error.message : String(error)
                }]
            });
        }
    };
}