import express from 'express';
import { UserController } from '../controllers/user.controllers.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const userRouter = express.Router();
const { getAll, getById, deleteUser, createUser, updateUser } = UserController;

userRouter
  .get('/users', authMiddleware, getAll)
  .get('/:id', authMiddleware, getById)
  .delete('/:id', authMiddleware, deleteUser)
  .post('/create', createUser)
  .patch('/:id', authMiddleware, updateUser);
export default userRouter;
