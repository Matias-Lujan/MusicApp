import express from 'express';
import { UserController } from '../controllers/user.controllers.js';

const userRouter = express.Router();
const { getAll, getById, deleteUser, createUser, updateUser } = UserController;

userRouter
  .get('/users', getAll)
  .get('/:id', getById)
  .delete('/:id', deleteUser)
  .post('/create', createUser)
  .patch('/:id', updateUser);
export default userRouter;
