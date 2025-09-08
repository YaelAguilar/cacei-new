//casos de uso
import { DeleteUserUseCase } from "../application/deleteUserUseCase";
import { GetUserUseCase } from "../application/getUserUseCase";
import { UpdateUserUseCase } from "../application/updateUserUseCase";
import { GetAllUsersUseCase } from "../application/getAllUsersUseCase";
//controladores
import { DeleteUserController } from "./controllers/deleteUserController";
import { GetUserController } from "./controllers/getUserController";
import { UpdateUserController } from "./controllers/updateUserController";
import { GetAllUsersController } from "./controllers/getAllUsersControllert";

import { MysqlUserRepository } from "./repositories/MysqlUserRepository";
const userRepository =  new MysqlUserRepository();


const deleteUserUseCase = new DeleteUserUseCase(userRepository);
export const deleteUserController = new DeleteUserController(deleteUserUseCase);

const getUserUseCase = new GetUserUseCase(userRepository);
export const getUserController = new GetUserController(getUserUseCase);

const getAllUsersUseCase = new GetAllUsersUseCase(userRepository);
export const getAllUsersController = new GetAllUsersController(getAllUsersUseCase);

const updateUserUseCase = new UpdateUserUseCase(userRepository);
export const updateUserController = new UpdateUserController(updateUserUseCase);
