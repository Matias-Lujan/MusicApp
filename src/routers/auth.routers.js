import express from 'express';
import { AuthController } from '../controllers/auth.controllers.js';

const authRouter = express.Router();
const { login, logout } = AuthController;

authRouter.post('/login', login).post('/logout', logout);
export default authRouter;
