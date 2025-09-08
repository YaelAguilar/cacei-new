import { Request, Response } from 'express';
import { GetUserUseCase } from '../../application/getUserUseCase';
import { User } from '../../domain/models/user';

export class GetUserController {
  constructor(private readonly getUserUseCase: GetUserUseCase) {}

  async run(req: Request, res: Response) {
    const { uuid } = req.params;

    try {
      const user: User | null = await this.getUserUseCase.run(uuid);
      if (user) {
        // Formato JSON:API
        const formattedUser = {
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
        };
        res.status(200).json({ data: formattedUser });
      } else {
        res.status(404).json({
          errors: [{
            status: "404",
            title: "User not found",
            detail: "No user found with the provided uuid"
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
