import { query } from "../../../database/mysql";
import { UserRepository } from "../../domain/interfaces/userRepository";
import { User } from "../../domain/models/user";

export class MysqlUserRepository implements UserRepository {
  async getUsers(): Promise<User[] | null> {
    // Hacemos el join para obtener los roles
    const sql = `
      SELECT 
        u.*, 
        r.id AS role_id,
        r.name AS role_name
      FROM users u
      LEFT JOIN role_users ru ON u.id = ru.id_user
      LEFT JOIN roles r ON ru.id_role = r.id
      WHERE u.active = true
    `;
    try {
      const result: any = await query(sql);

      if (result.length > 0) {
        const usersMap = new Map<number | string, any>();

        result.forEach((row: any) => {
          if (!usersMap.has(row.id)) {
            usersMap.set(row.id, {
              ...row,
              roles: row.role_id && row.role_name ? [{ id: row.role_id, name: row.role_name }] : []
            });
          } else {
            const user = usersMap.get(row.id);
            // Evita duplicados
            if (
              row.role_id &&
              row.role_name &&
              !user.roles.some((r: any) => r.id === row.role_id)
            ) {
              user.roles.push({ id: row.role_id, name: row.role_name });
            }
          }
        });

        return Array.from(usersMap.values()).map((user: any) => new User(
          user.id,
          user.name,
          user.lastName,
          user.secondLastName,
          user.email,
          user.phone,
          user.password,
          user.uuid,
          user.roles, // Ahora es un arreglo de objetos {id, name}
          user.active,
          user.created_at,
          user.updated_at,
          user.user_creation,
          user.user_update
        ));
      } else {
        return null;
      }
    } catch (error) {
      throw new Error(`Error obtaining users: ${error}`);
    }
  }

  async getUser(uuid: string): Promise<User | null> {
    const sql = `
      SELECT 
        u.*, 
        r.id AS role_id,
        r.name AS role_name
      FROM users u
      LEFT JOIN role_users ru ON u.id = ru.id_user
      LEFT JOIN roles r ON ru.id_role = r.id
      WHERE u.uuid = ?
      LIMIT 1
    `;
    const params: any[] = [uuid];
    try {
      const result: any = await query(sql, params);
      if (result.length > 0) {
        const userRow = result[0];
        // Recopila todos los roles del usuario
        const roles = result
          .filter((row: any) => row.role_id && row.role_name)
          .map((row: any) => ({ id: row.role_id, name: row.role_name }));

        return new User(
          userRow.id,
          userRow.name,
          userRow.lastName,
          userRow.secondLastName,
          userRow.email,
          userRow.phone,
          userRow.password,
          userRow.uuid,
          roles,
          userRow.active,
          userRow.created_at,
          userRow.updated_at,
          userRow.user_creation,
          userRow.user_update
        );
      } else {
        return null;
      }
    } catch (error) {
      throw new Error(`Error obtaining user: ${error}`);
    }
  }

  async updateUser(uuid: string, updatedData: Partial<User>): Promise<User | null> {
    const fields: string[] = [];
    const params: any[] = [];

    if(updatedData.getName && updatedData.getName()){
      fields.push("name = ?");
      params.push(updatedData.getName());
    }

    if(updatedData.getLastName && updatedData.getLastName()){
      fields.push("lastName = ?");
      params.push(updatedData.getLastName());
    }

    if(updatedData.getSecondLastName && updatedData.getSecondLastName()){
      fields.push("secondLastName = ?");
      params.push(updatedData.getSecondLastName());
    }

    if(updatedData.getEmail && updatedData.getEmail()){
      fields.push("email = ?");
      params.push(updatedData.getEmail());
    }

    if(updatedData.getPhone && updatedData.getPhone()){
      fields.push("phone = ?");
      params.push(updatedData.getPhone());
    }
    
    if (updatedData.getPassword && updatedData.getPassword()){
      fields.push("password = ?");
      params.push(updatedData.getPassword());
    }

    params.push(uuid);

    const sql = ` UPDATE users SET ${fields.join(", ")} WHERE uuid = ?`

    try {
      const result:any = await query(sql, params);
      if (result.affectedRows === 0) {
        return null;
      }

      const updatedUser: User = new User(
        uuid,
        updatedData.getName ? updatedData.getName() : "",
        updatedData.getLastName ? updatedData.getLastName() : "",
        updatedData.getSecondLastName ? updatedData.getSecondLastName() : "",
        updatedData.getEmail ? updatedData.getEmail() : "",
        updatedData.getPhone ? updatedData.getPhone() : "",
        updatedData.getPassword ? updatedData.getPassword() : "",
      )

      return updatedUser;
    } catch (error) {
      console.error('Error in MysqlUserRepository:', error);
      throw new Error('Error al actualizar el usuario: ' + error);
    }
  }

  async deleteUser(uuid: string): Promise<User | null> {
    const sql = "UPDATE users SET active = false WHERE uuid = ?";
    const params: any[] = [uuid];
    try {
      const result: any = await query(sql, params);
      return result;
    } catch (error) {
      throw new Error(`Error deleting user: ${error}`);
    }
  }
}