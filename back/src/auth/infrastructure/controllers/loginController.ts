import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { LoginUseCase } from '../../application/loginUseCase';

export class LoginController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  async run(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    try {
      const user = await this.loginUseCase.run(email, password);
      if (!user) {
        res.status(401).json({
          errors: [{
            status: "401",
            title: "Unauthorized",
            detail: "Correo o contraseña incorrectos"
          }]
        });
        return;
      }

      // Genera el JWT solo con uuid y roles
      const payload = {
        uuid: user.getUuid(),
        roles: user.getRoles()
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '5d' });

      // Setea la cookie por 5 días
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 5 * 24 * 60 * 60 * 1000 // 5 días
      });

      // Responde con JSON-API
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