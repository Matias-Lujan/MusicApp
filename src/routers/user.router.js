import express from 'express';
import { UserController } from '../controllers/user.controllers.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { isAdmin } from '../middleware/admin.middleware.js';

const userRouter = express.Router();
const { getAll, getById, deleteUser, createUser, updateUser } = UserController;

userRouter
  //registrarse
  .post('/create', createUser)
  //estar logueado y ser admin
  .get('/users', authMiddleware, isAdmin, getAll)
  .get('/:id', authMiddleware, isAdmin, getById)
  .delete('/:id', authMiddleware, isAdmin, deleteUser)
  .patch('/:id', authMiddleware, isAdmin, updateUser);
export default userRouter;
