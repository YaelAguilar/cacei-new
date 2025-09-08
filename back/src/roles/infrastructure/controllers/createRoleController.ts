import { Request, Response } from 'express';
import { CreateRoleUseCase } from '../../application/createRoleUseCase';

export class CreateRoleController {
    constructor(private readonly createRoleUseCase: CreateRoleUseCase) {}

    async run(req: Request, res: Response) {
        try {
            // Extraer los atributos del cuerpo de la solicitud siguiendo el formato JSON:API
            const { data } = req.body;
            
            if (!data || data.type !== 'role' || !data.attributes) {
                res.status(400).json({
                    errors: [{
                        status: "400",
                        title: "Invalid request format",
                        detail: "Request must follow JSON:API format with type 'role' and attributes"
                    }]
                });
                return;
            }

            const { name, description } = data.attributes;

            if (!name) {
                res.status(400).json({
                    errors: [{
                        status: "400",
                        title: "Missing required attribute",
                        detail: "Role name is required"
                    }]
                });
                return;
            }

            const newRole = await this.createRoleUseCase.run(name, description || '');

            if (!newRole) {
                throw new Error("Failed to create role");
            }

            // Formato de respuesta según JSON:API
            res.status(201).json({
                data: {
                    type: "role",
                    id: newRole.getUuid(),
                    attributes: {
                        name: newRole.getName(),
                        description: newRole.getDescription()
                    },
                    meta: {
                        menuCount: 0,
                        submenuCount: 0
                    }
                }
            });
        } catch (error) {
            console.error("Error creating role:", error);
            res.status(500).json({
                errors: [{
                    status: "500",
                    title: "Error creating Role",
                    detail: error instanceof Error ? error.message : String(error)
                }]
            });
        }
    }
}