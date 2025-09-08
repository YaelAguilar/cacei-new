import { Request, Response } from 'express';
import { UpdateUserUseCase } from '../../application/updateUserUseCase';

export class UpdateUserController {
  constructor(private readonly updateUserUseCase: UpdateUserUseCase) {}

  async run(req: Request, res: Response) {
    const { uuid } = req.params;
    const { name, lastName, secondLastName, email, phone, password } = req.body;

    try {
      const user = await this.updateUserUseCase.run(uuid, name, lastName, secondLastName, email, phone, password);
      if (user) {
        // Formato JSON:API
        const formattedUser = {
          type: "user",
          id: user.getUuid(),
          attributes: {
            name: user.getName(),
            email: user.getEmail(),
            phone: user.getPhone(),
            fullName: user.getFullName && user.getFullName(),
            roles: user.getRoles && user.getRoles(),
            createdAt: user.getCreatedAt && user.getCreatedAt(),
            updatedAt: user.getUpdatedAt && user.getUpdatedAt(),
            userCreation: user.getUserCreation && user.getUserCreation(),
            userUpdate: user.getUserUpdate && user.getUserUpdate(),
            active: user.isActive && user.isActive()
          }
        };
        res.status(200).json({ data: formattedUser });
      } else {
        res.status(400).json({
          errors: [{
            status: "400",
            title: "Could not update user",
            detail: "No se pudo actualizar el usuario"
          }]
        });
      }
    } catch (error) {
      res.status(500).json({
        errors: [{
          status: "500",
          title: "Server error",
          detail: error instanceof Error ? error.message : String(error)
        }]
      });
    }
  }
}
