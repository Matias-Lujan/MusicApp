import { RepositoryFactory } from '../repository/repositoryFactory.js';
import { userService } from '../services/user.service.js';
import { userListResponseDTO, userResponseDTO } from '../dto/userDTO.js';

const database = RepositoryFactory.getUserRepository();

export const UserController = {
  getAll: async (req, res) => {
    try {
      const users = await database.getAll();
      res.json({ status: 200, OK: true, payload: userListResponseDTO(users) });
    } catch (error) {
      console.log('Error al obtener los usuarios', error.message);
      res.status(500).json({ error: 'error interno del server' });
    }
  },

  getById: async (req, res) => {
    const id = req.params.id;
    console.log(`ID enviado x parametro -> ${id}`);

    try {
      const responseData = await database.getById(id);

      if (!responseData) {
        return res
          .status(404)
          .json({ status: 404, OK: false, message: `No existe usuario para ID -> ${id}` });
      }

      return res.json({
        status: 200,
        OK: true,
        message: 'Existe el usuario',
        payload: userResponseDTO(responseData),
      });
    } catch (error) {
      return res
        .status(400)
        .json({ status: 400, OK: false, message: `No existe usuario para ID -> ${id}` });
    }
  },

  createUser: async (req, res) => {
    try {
      const user = await userService.createUser(req.body);
      return res.json({
        status: 200,
        OK: true,
        message: 'Usuario creado',
        payload: userResponseDTO(user),
      });
    } catch (error) {
      return res.status(400).json({ status: 400, OK: false, message: error.message });
    }
  },

  deleteUser: async (req, res) => {
    const { id } = req.params;
    console.log(`ID enviado x parametro -> ${id}`);

    try {
      const data = await userService.deleteUserById(id);

      return res.json({
        status: 200,
        OK: true,
        message: `Usuario ID -> ${id} eliminado de la base de datos`,
        payload: userResponseDTO(data),
      });
    } catch (error) {
      return res.status(400).json({ status: 400, OK: false, message: error.message });
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
