import { RepositoryFactory } from '../repository/repositoryFactory.js';
import { userService } from '../services/user.service.js';
import { userListResponseDTO, userResponseDTO } from '../dto/userDTO.js';

const database = RepositoryFactory.getUserRepository();

export const UserController = {
  getAll: async (req, res) => {
    try {
      const users = await database.getAll();
      res.status(200).json({
        status: 200,
        OK: true,
        payload: userListResponseDTO(users),
      });
    } catch (error) {
      const status = error.statusCode || 500;
      res.status(status).json({
        status,
        OK: false,
        message: error.message,
      });
    }
  },

  getById: async (req, res) => {
    const { id } = req.params;

    try {
      const user = await userService.getUserById(id);

      return res.status(200).json({
        status: 200,
        OK: true,
        payload: userResponseDTO(user),
      });
    } catch (error) {
      const status = error.statusCode || 400;
      return res.status(status).json({
        status,
        OK: false,
        message: error.message,
      });
    }
  },

  createUser: async (req, res) => {
    try {
      const user = await userService.createUser(req.body);
      return res.status(200).json({
        status: 200,
        OK: true,
        message: 'Usuario creado',
        payload: userResponseDTO(user),
      });
    } catch (error) {
      const status = error.statusCode || 400;
      return res.status(status).json({
        status,
        OK: false,
        message: error.message,
      });
    }
  },

  deleteUser: async (req, res) => {
    const { id } = req.params;
    console.log(`ID enviado x parametro -> ${id}`);

    try {
      const data = await userService.deleteUserById(id);

      return res.status(200).json({
        status: 200,
        OK: true,
        message: `Usuario ID -> ${id} eliminado de la base de datos`,
        payload: userResponseDTO(data),
      });
    } catch (error) {
      const status = error.statusCode || 400;
      return res.status(status).json({
        status,
        OK: false,
        message: error.message,
      });
    }
  },

  updateUser: async (req, res) => {
    const { id } = req.params;

    try {
      const { oldDataUser, newDataUser } = await userService.updateUserById(id, req.body);

      return res.status(200).json({
        status: 200,
        OK: true,
        oldDataUser: userResponseDTO(oldDataUser),
        newDataUser: userResponseDTO(newDataUser),
      });
    } catch (error) {
      const status = error.statusCode || 400;

      return res.status(status).json({
        status,
        OK: false,
        message: error.message,
      });
    }
  },
};
