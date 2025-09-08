import { Request, Response } from 'express';
import { SignupUseCase } from '../../application/signupUseCase';
import bcrypt from "bcrypt";

export class SignupController {
  constructor(private readonly signupUseCase: SignupUseCase) {}

  async run(req: Request, res: Response) {
    const { name, lastName, secondLastName, email, phone, password } = req.body;

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(password, salt);

    try {
      const user = await this.signupUseCase.run(name, lastName, secondLastName, email, phone, hashPassword);
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
        res.status(201).json({ data: formattedUser });
      } else {
        res.status(400).json({
          errors: [{
            status: "400",
            title: "Could not create user",
            detail: "No se pudo crear el usuario"
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