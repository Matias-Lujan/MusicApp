import bcrypt from 'bcryptjs';
import { RepositoryFactory } from '../repository/repositoryFactory.js';
import { isNonEmptyString, isValidEmail, normalizeEmail } from '../utils/validations.utils.js';
import { signAccessToken, signRefreshToken } from './auth.tokens.js';
import { sha256 } from '../utils/token.utils.js';
import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

const userRepository = RepositoryFactory.getUserRepository();
const refreshTokenRepository = RepositoryFactory.getRefreshTokenRepository();

export const authService = {
  async loginUser({ email, password, meta }) {
    if (!isNonEmptyString(email) || !isNonEmptyString(password)) {
      throw new Error('El email y la contraseña son obligatorios');
    }
    const normalizedEmail = normalizeEmail(email);

    if (!isValidEmail(normalizedEmail)) {
      throw new Error('El email debe tener un formato valido');
    }

    const user = await userRepository.getByEmail(normalizedEmail);

    if (!user) throw new Error(`Usuario no encontrado con email: ${email}`);

    const passwordValidated = await bcrypt.compare(password, user.password);

    if (!passwordValidated) {
      throw new Error('Password invalida');
    }

    const { password: _password, ...safeUser } = user; // destructuring para eliminar el password del user que se va a retornar

    const accessToken = signAccessToken({
      userId: safeUser.id,
      role: safeUser.role,
    });

    const { refreshToken, tokenHash, jti, expiresAt } = signRefreshToken({
      userId: safeUser.id,
    });

    // Almacenar el refresh token (hash) en la base de datos
    await refreshTokenRepository.insertRefreshToken({
      user_id: safeUser.id,
      token_hash: tokenHash,
      jti,
      expires_at: expiresAt.toISOString(),
      user_agent: meta?.userAgent ?? null,
      ip: meta?.ip ?? null,
    });

    return {
      user: { ...safeUser },
      accessToken,
      refreshToken,
    };
  },

  async logoutUser({ refreshToken }) {
    if (!refreshToken) {
      throw new Error('Refresh token es obligatorio para logout');
    }

    const tokenHash = sha256(refreshToken);

    await refreshTokenRepository.revokeByHash(tokenHash);

    return { message: 'Sesion cerrada' };
  },

  async refreshSesion({ refreshToken, meta }) {
    if (!refreshToken) throw new Error('Refresh token es obligatorio para refrescar sesion');
    // 1) Verificar JWT refresh (firma + exp)
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, config.JWT_REFRESH_SECRET);
    } catch {
      throw new Error('Refresh token invalido o expirado');
    }

    const userId = decoded.sub;
    const oldTokenHash = sha256(refreshToken);

    // 2) Verificar que el refresh token exista en BD
    const dbToken = await refreshTokenRepository.findByHash(oldTokenHash);
    if (!dbToken) throw new Error('Refresh token no encontrado en base de datos');

    // 3) Si ya está revocado => reuso (posible robo)
    if (dbToken.revoked_at) {
      // Revocar todos los refresh tokens del usuario (Logout de todos los dispositivos)
      await refreshTokenRepository.revokeAllForUser(userId);
      throw new Error(
        'Refresh token reutilizado. Todas las sesiones han sido cerradas por seguridad.',
      );
    }

    // 4) Obtener role desde DB (no confiar solo en token)
    const user = await userRepository.getById(userId);
    if (!user) throw new Error('Usuario no encontrado');

    const role = user.role;

    // 5) Generar tokens nuevos
    const newAccessToken = signAccessToken({ userId, role });
    const {
      refreshToken: newRefreshToken,
      tokenHash: newHash,
      jti: newJti,
      expiresAt,
    } = signRefreshToken({ userId });

    // 6) Guardar nuevo refresh token en BD
    await refreshTokenRepository.insertRefreshToken({
      user_id: userId,
      token_hash: newHash,
      jti: newJti,
      expires_at: expiresAt.toISOString(),
      user_agent: meta?.userAgent ?? null,
      ip: meta?.ip ?? null,
    });

    // 7) Rotar: revocar el refresh token viejo y marcar reemplazo
    await refreshTokenRepository.revokeAndReplace({
      oldTokenHash,
      replacedByJti: newJti,
    });

    return { newAccessToken, refreshToken: newRefreshToken };
  },
};
