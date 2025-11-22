import express from 'express';
import { AuthController } from '../controllers/auth.controllers.js';

const authRouter = express.Router();
const { login } = AuthController;

authRouter.post('/api/auth/login', login);
export default authRouter;
