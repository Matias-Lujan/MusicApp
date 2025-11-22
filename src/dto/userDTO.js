import { toTitleCase } from '../utils/string.utils.js';

export const userResponseDTO = (user) => {
  if (!user) return null;

  return {
    id: user.id,
    nombre: toTitleCase(user.nombre),
    apellido: toTitleCase(user.apellido),
    email: user.email,
  };
};

export const userListResponseDTO = (users = []) => {
  return users.map((user) => userResponseDTO(user));
};
