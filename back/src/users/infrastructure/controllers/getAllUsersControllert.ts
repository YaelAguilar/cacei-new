import { Request, Response } from "express";
import { GetAllUsersUseCase } from "../../application/getAllUsersUseCase";
import { User } from "../../domain/models/user";

export class GetAllUsersController {
    constructor(private readonly getAllUsersUseCase: GetAllUsersUseCase) {}

    async run(req: Request, res: Response) {
        try {
            const users: User[] | null = await this.getAllUsersUseCase.execute();

            console.log("Usuarios obtenidos:", users);

            // Transformamos los usuarios al formato JSON:API
            const formattedUsers = users ? users.map(user => ({
                type: "user",
                id: user.getUuid(),
                attributes: {
                    name: user.getName(),
                    email: user.getEmail(),
                    phone: user.getPhone(),
                    fullName: user.getFullName(),
                    roles: user.getRoles(),
                    createdAt: user.getCreatedAt(),
                    updatedAt: user.getUpdatedAt(),
                    userCreation: user.getUserCreation(),
                    userUpdate: user.getUserUpdate(),
                    active: user.isActive()
                }
            })) : [];

            // Respuesta en formato JSON:API
            res.status(200).json({
                data: formattedUsers
            });
        } catch (error) {
            console.log("Error al obtener los usuarios");
            res.status(500).json({
                errors: [{
                    status: "500",
                    title: "Error retrieving Users",
                    detail: error instanceof Error ? error.message : String(error)
                }]
            });
        }
    }
}