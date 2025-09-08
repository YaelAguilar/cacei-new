import { AuthRepository } from "../../domain/interfaces/authRepository";
import { User } from "../../domain/models/user";
import bcrypt from "bcrypt";
import { query } from "../../../database/mysql";
import { v4 as uuidv4 } from 'uuid';

export class MysqlAuthRepository implements AuthRepository {
    async signup(
        name: string,
        lastName: string,
        secondLastName: string,
        email: string,
        phone: string,
        password: string
    ): Promise<User | null> {
        const sql =
        "INSERT INTO users (uuid, name, lastName, secondLastName, email, phone, password) VALUES (?, ?, ?, ?, ?, ?, ?)";
        const uuid = uuidv4();
        const params: any[] = [uuid, name, lastName, secondLastName, email, phone, password];
        
        try {
        const result: any = await query(sql, params);
        return new User(
            result.insertId,
            name,
            lastName,
            secondLastName,
            email,
            phone,
            password,
            uuid
        );
        } catch (error) {
        console.error("Error during user signup:", error);
        return null;
        }
    }

    async login(email: string, password: string): Promise<User | null> {
        const sql = `
          SELECT 
            u.*,
            r.uuid AS uuid, 
            r.id AS role_id,
            r.name AS role_name
          FROM users u
          LEFT JOIN role_users ru ON u.id = ru.id_user
          LEFT JOIN roles r ON ru.id_role = r.id
          WHERE u.email = ?
          LIMIT 1
        `;
        const params = [email];
        const result: any = await query(sql, params);

        if (result.length === 0) return null;

        const userRow = result[0];
        const passwordMatch = await bcrypt.compare(password, userRow.password);
        if (!passwordMatch) return null;

        // Recopila roles
        const roles = result
          .filter((row: any) => row.role_id && row.role_name)
          .map((row: any) => ({ id: row.uuid, name: row.role_name }));

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
      }
}