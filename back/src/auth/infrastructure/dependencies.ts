//casos de uso
import { SignupUseCase } from "../application/signupUseCase";
import { LoginUseCase } from "../application/loginUseCase";

//controladores
import { SignupController } from "./controllers/signupController";
import { LoginController } from "./controllers/loginController";

import { MysqlAuthRepository } from "./repositories/MysqlAuthRepository";

const authRepository = new MysqlAuthRepository();


const signupUseCase = new SignupUseCase(authRepository);
export const signupController = new SignupController(signupUseCase);
const loginUseCase = new LoginUseCase(authRepository);
export const loginController = new LoginController(loginUseCase);