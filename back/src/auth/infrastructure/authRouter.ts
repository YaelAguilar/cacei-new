import express from 'express';
import { signupController, loginController } from './dependencies';

export const authRouter = express.Router();
authRouter.post('/signup', signupController.run.bind(signupController));
authRouter.post('/signin', loginController.run.bind(loginController));