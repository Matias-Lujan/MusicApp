import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization; //header Authorization: Bearer <token>

  if (!authHeader) {
    res.status(401).json({
      status: 401,
      OK: false,
      message: 'No se ha proporcionado token de autenticación',
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET_KEY);

    req.user = decoded;

    next();
  } catch (error) {
    res.json({
      status: 401,
      OK: false,
      message: 'Token inválido o expirado',
    });
    return;
  }
}
