import { AuthRepository } from "../data/repository/authRepository";
import { LoginRequest } from "../data/models/LoginDTO";
import { User } from "../data/models/User";
import { UserPermissions } from "../data/models/MenuPermission";

export class LoginUseCase {
  constructor(private repository: AuthRepository) {}

  async execute(email: string, password: string): Promise<{
    user: User;
    token: string;
    permissions: UserPermissions;
  } | null> {
    try {
      if (!email || !password) {
        throw new Error("Email y contraseña son obligatorios");
      }

      const loginRequest: LoginRequest = { email, password };
      const loginResult = await this.repository.login(loginRequest);

      console.log("Resultado del login:", loginResult);

      if (!loginResult) {
        return null;
      }

      // Obtener permisos del usuario
      const permissions = await this.repository.getUserPermissions(
        loginResult.user.getRoles() || []
      );

      if (!permissions) {
        throw new Error("No se pudieron obtener los permisos del usuario");
      }

      return {
        user: loginResult.user,
        token: loginResult.token,
        permissions
      };
    } catch (error) {
      console.error("Error en LoginUseCase:", error);
      throw error;
    }
  }
}
