import AuthController from '@/controllers/auth.controller';
import { Router } from 'express';
import { authMiddleware } from '@/middlewares/auth.middleware';

/**
 * /auth
 */
const authRouter = Router();
authRouter.post('/login', (req, res) => AuthController.login(req, res));
authRouter.post('/signup', (req, res) => AuthController.signup(req, res));
authRouter.post('/verify-token', authMiddleware, (req, res) =>
  AuthController.verifyToken(req, res)
);

export default authRouter;
