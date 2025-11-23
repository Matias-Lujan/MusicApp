//import bcrypt from 'bcrypt';
import bcrypt from 'bcryptjs';
import { RepositoryFactory } from '../repository/repositoryFactory.js';
import {
  isNonEmptyString,
  isValidEmail,
  normalizeEmail,
  isValidBirthDate,
} from '../utils/validations.utils.js';

const database = RepositoryFactory.getUserRepository();

function validateUserPayload(
  { nombre, apellido, email, fecha_nacimiento, password },
  { isUpdate = false } = {},
) {
  if (!isUpdate || nombre !== undefined) {
    if (!isNonEmptyString(nombre)) {
      throw new Error('El nombre es obligatorio y no puede estar vacío');
    }
  }

  if (!isUpdate || apellido !== undefined) {
    if (!isNonEmptyString(apellido)) {
      throw new Error('El apellido es obligatorio y no puede estar vacío');
    }
  }

  if (!isUpdate || email !== undefined) {
    if (!isValidEmail(email)) {
      throw new Error('El email es obligatorio y debe tener un formato válido');
    }
  }

  if (!isUpdate || fecha_nacimiento !== undefined) {
    if (!isValidBirthDate(fecha_nacimiento)) {
      throw new Error(
        'La fecha de nacimiento es obligatoria y debe ser igual o mayor a al menos 18 años',
      );
    }
  }

  // password
  if (!isUpdate || password !== undefined) {
    if (!isNonEmptyString(password)) {
      throw new Error('La contraseña es obligatoria y no puede estar vacía');
    } else if (password.length < 8) {
      throw new Error('La contraseña debe tener al menos 8 caracteres');
    } else if (password.length > 50) {
      throw new Error('La contraseña no puede superar los 50 caracteres');
    }
  }
}

export const userService = {
  async createUser(payload) {
    validateUserPayload(payload, { isUpdate: false });

    const nombre = payload.nombre.trim();
    const apellido = payload.apellido.trim();
    const email = normalizeEmail(payload.email);
    const fecha_nacimiento = payload.fecha_nacimiento;
    const password = payload.password;

    const passwordHash = await bcrypt.hash(password, 10);

    const user = {
      nombre,
      apellido,
      email,
      fecha_nacimiento,
      password: passwordHash,
      role: 'USER',
    };
    let userCreated;
    try {
      userCreated = await database.createOne(user);
    } catch (error) {
      if (error.message && error.message.includes('duplicate key value')) {
        const err = new Error('Ya existe un usuario registrado con ese email');
        err.statusCode = 409;
        throw err;
      }
      throw error;
    }

    if (userCreated && userCreated.password) {
      delete userCreated.password;
    }

    return userCreated;
  },

  async updateUserById(id, payload) {
    const user = await database.getById(id);

    if (!user) {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error;
    }

    const oldDataUser = { ...user };
    if (oldDataUser.password) {
      delete oldDataUser.password;
    }

    validateUserPayload(payload, { isUpdate: true });

    const dataToUpdate = {};

    if (payload.nombre !== undefined) {
      dataToUpdate.nombre = payload.nombre.trim();
    }

    if (payload.apellido !== undefined) {
      dataToUpdate.apellido = payload.apellido.trim();
    }

    if (payload.email !== undefined) {
      dataToUpdate.email = normalizeEmail(payload.email);
    }

    if (payload.fecha_nacimiento !== undefined) {
      dataToUpdate.fecha_nacimiento = payload.fecha_nacimiento;
    }

    if (payload.password !== undefined) {
      const passwordHash = await bcrypt.hash(payload.password, 10);
      dataToUpdate.password = passwordHash;
    }

    if (payload.role !== undefined) {
      const role = String(payload.role).toUpperCase().trim();

      if (!['ADMIN', 'USER'].includes(role)) {
        const error = new Error('Rol invalido. Los roles validos son ADMIN o USER');
        error.statusCode = 400;
        throw error;
      }

      dataToUpdate.role = role;
    }

    if (Object.keys(dataToUpdate).length === 0) {
      const error = new Error('No se enviaron campos para actualizar');
      error.statusCode = 400;
      throw error;
    }

    let newDataUser;
    try {
      newDataUser = await database.updateOne(id, dataToUpdate);
    } catch (error) {
      if (error.message && error.message.includes('duplicate key value')) {
        const err = new Error(
          'No se puede actualizar el email porque ya existe un usuario registrado con ese email',
        );
        err.statusCode = 409;
        throw err;
      }
      throw error;
    }

    if (!newDataUser) {
      const error = new Error('No se pudo actualizar el usuario');
      error.statusCode = 400;
      throw error;
    }

    if (newDataUser.password) {
      delete newDataUser.password;
    }

    return { oldDataUser, newDataUser };
  },

  async deleteUserById(id) {
    const user = await database.getById(id);

    if (!user) {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error;
    }

    const deletedUser = await database.deleteOne(id);

    if (!deletedUser) {
      const error = new Error('No se pudo eliminar el usuario');
      error.statusCode = 400;
      throw error;
    }

    return deletedUser;
  },
};
