import { User } from "../domain/models/user";
import { UserRepository } from "../domain/interfaces/userRepository";

export class GetAllUsersUseCase {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(): Promise<User[] | null> {
        try {
            const users = await this.userRepository.getUsers();
            return users;
        } catch (error) {
            console.error("Error in GetAllUsersUseCase:", error);
            throw error;
        }
    }
}