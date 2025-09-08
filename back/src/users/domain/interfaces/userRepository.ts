import { User } from "../models/user";
export interface UserRepository {
  getUser(uuid: string): Promise<User | null>;

  getUsers(): Promise<User[] | null>;

  updateUser(
    uuid: string,
    updatedData: Partial<User>
  ): Promise<User | null>;

  deleteUser(uuid: string): Promise<User | null>;
}
