import bcrypt from 'bcryptjs';
import { RepositoryFactory } from '../repository/repositoryFactory.js';
import { isNonEmptyString, isValidEmail, normalizeEmail } from '../utils/validations.utils.js';
import { signAccessToken, signRefreshToken } from './auth.tokens.js';

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
};
