import express from 'express';
import { AuthController } from '../controllers/auth.controllers.js';

const authRouter = express.Router();
const { login, logout, refreshToken } = AuthController;

authRouter
    .post('/login', login)
    .post('/logout', logout)
    .post('/refresh-token', refreshToken);
export default authRouter;
