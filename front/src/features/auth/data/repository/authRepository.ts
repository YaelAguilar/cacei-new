import ApiClient from "../../../../core/API/ApiClient";
import { LoginRequest, JsonApiLoginResponse } from "../models/LoginDTO";
import { User } from "../models/User";
import { RolePermissionResponse, UserPermissions } from "../models/MenuPermission";

export class AuthRepository {
  async login(credentials: LoginRequest): Promise<{ user: User; token: string } | null> {
    try {
      const response = await ApiClient.post<JsonApiLoginResponse>('/auth/signin', {
        email: credentials.email,
        password: credentials.password
      });

      if (response.status === 200) {
        const userData = response.data.data.attributes;
        console.log("Datos del usuario en AuthRepository:", userData);
        
        const user = new User(
          '',
          userData.name,
          userData.lastName,
          userData.secondLastName,
          userData.email,
          '',
          '',
          userData.uuid,
          userData.roles,
          true,
          undefined,
          undefined,
          undefined,
          undefined
        );
        
        const token = response.data.data.attributes.token;
        return { user, token };
      }
      
      return null;
    } catch (error) {
      console.error("Error en login:", error);
      throw error;
    }
  }

  async getUserPermissions(userRoles: { id: number, name: string }[]): Promise<UserPermissions | null> {
    try {
      // Asumiendo que necesitas obtener permisos del primer rol activo
      // Puedes ajustar esta lógica según tu backend
      const primaryRole = userRoles[0];
      if (!primaryRole) return null;

      const response = await ApiClient.get<RolePermissionResponse>(`/roles/${primaryRole.id}/permissions`);
      
      return response.data.data.relationships.availablePermissions;
    } catch (error) {
      console.error("Error al obtener permisos:", error);
      return null;
    }
  }

  async logout(): Promise<boolean> {
    try {
      await ApiClient.post('/auth/logout');
      return true;
    } catch (error) {
      console.error("Error en logout:", error);
      return true;
    }
  }
}