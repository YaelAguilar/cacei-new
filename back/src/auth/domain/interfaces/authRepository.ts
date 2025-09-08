import { User } from "../models/user";

export interface AuthRepository {
     signup(
        name: string,
        firstName: string,
        secondLastName: string,
        email: string,
        phone: string,
        password: string
      ): Promise<User | null>;

      login(email: string, password: string): Promise<User | null>;
}