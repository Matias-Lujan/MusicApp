import express from 'express';
import { UserController } from '../controllers/user.controllers.js';

const userRouter = express.Router();
const { getAll, getById, deleteUser, createUser, updateUser } = UserController;

userRouter
  .get('/api/users', getAll)
  .get('/api/user/:id', getById)
  .delete('/api/user/:id', deleteUser)
  .post('/api/user', createUser)
  .patch('/api/user/:id', updateUser);
export default userRouter;
