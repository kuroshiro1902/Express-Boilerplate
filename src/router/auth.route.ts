import AuthController from '@/controllers/auth.controller';
import { Router } from 'express';
import { authMiddleware } from '@/middlewares/auth.middleware';

/**
 * /auth
 */
const authRouter = Router();
authRouter.post('/login', AuthController.login);
authRouter.post('/signup', AuthController.signup);
authRouter.post('/verify-token', authMiddleware, AuthController.verifyToken);

export default authRouter;
