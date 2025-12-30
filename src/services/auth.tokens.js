import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import { newJti, sha256, toDateFromJwtExp } from '../utils/token.utils.js';

export function signAccessToken({ userId, role }) {
  return jwt.sign(
    {
      role: role,
    },
    config.JWT_ACCESS_SECRET,
    {
      subject: userId,
      expiresIn: config.JWT_ACCESS_EXPIRES,
    },
  );
}

export function signRefreshToken({ userId }) {
  const jti = newJti(); // id del token: sirve para la rotación y revocación de tokens

  const refreshToken = jwt.sign(
    {
      jti,
    },
    config.JWT_REFRESH_SECRET,
    {
      subject: userId,
      expiresIn: config.JWT_REFRESH_EXPIRES,
    },
  );

  const decoded = jwt.decode(refreshToken);
  const expiresAt = toDateFromJwtExp(decoded.exp);

  return {
    refreshToken, // el token en sí que se entrega al cliente
    tokenHash: sha256(refreshToken), // hash del token para almacenarlo de forma segura en la base de datos
    jti, // id del token para futuras referencias (rotación/revocación)
    expiresAt, // fecha de expiración del token
  };
}
