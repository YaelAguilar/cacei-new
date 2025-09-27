import { Request, Response } from "express";
import { GetCurrentUserUseCase } from "../../application/getCurrentUserUseCase";
import { MysqlUserRepository } from "../../../users/infrastructure/repositories/MysqlUserRepository";

export class GetCurrentUserController {
  private getCurrentUserUseCase: GetCurrentUserUseCase;

  constructor() {
    const userRepository = new MysqlUserRepository();
    this.getCurrentUserUseCase = new GetCurrentUserUseCase(userRepository);
  }

  async run(req: Request, res: Response): Promise<void> {
    try {
      console.log('🏁 GetCurrentUserController iniciado');
      
      // El UUID viene del middleware de autenticación
      const userUuid = (req as any).user?.uuid;
      
      if (!userUuid) {
        console.log('❌ No se encontró UUID en el token');
        res.status(401).json({
          success: false,
          message: "Token inválido o expirado"
        });
        return;
      }

      console.log('📝 UUID extraído del token:', userUuid);

      const user = await this.getCurrentUserUseCase.execute(userUuid);

      if (!user) {
        console.log('❌ Usuario no encontrado');
        res.status(404).json({
          success: false,
          message: "Usuario no encontrado"
        });
        return;
      }

      console.log('✅ Usuario obtenido exitosamente');

      res.status(200).json({
        success: true,
        data: {
          id: user.getId(),
          uuid: user.getUuid(),
          name: user.getName(),
          lastName: user.getLastName(),
          secondLastName: user.getSecondLastName(),
          email: user.getEmail(),
          roles: user.getRoles()
        }
      });

    } catch (error) {
      console.error('❌ Error en GetCurrentUserController:', error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor"
      });
    }
  }
}

