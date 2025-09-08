import express from "express";
import { deleteUserController, updateUserController, getUserController, getAllUsersController } from "./dependencies";

export const userRouter = express.Router();

userRouter.get("/", getAllUsersController.run.bind(getAllUsersController));
// Rutas que usan parametros dinamicos
userRouter.get('/user/:uuid', getUserController.run.bind(getUserController));
userRouter.put('/:uuid', updateUserController.run.bind(updateUserController));
userRouter.delete('/:uuid', deleteUserController.run.bind(deleteUserController));