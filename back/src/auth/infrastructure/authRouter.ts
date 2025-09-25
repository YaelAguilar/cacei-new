import express from 'express';
import { signupController, loginController } from './dependencies';
import { GetCurrentUserController } from './controllers/getCurrentUserController';
import { authMiddleware } from '../../utils/middlewares/authMiddleware';

export const authRouter = express.Router();
authRouter.post('/signup', signupController.run.bind(signupController));
authRouter.post('/signin', loginController.run.bind(loginController));

// Endpoint para obtener información del usuario actual
const getCurrentUserController = new GetCurrentUserController();
authRouter.get('/me', authMiddleware, (req, res) => getCurrentUserController.run(req, res));