import bcrypt from 'bcryptjs';
import { RepositoryFactory } from '../repository/repositoryFactory.js';
import { isNonEmptyString, isValidEmail, normalizeEmail } from '../utils/validations.utils.js';

const database = RepositoryFactory.getUserRepository();

export const authService = {
  async loginUser({ email, password }) {
    if (!isNonEmptyString(email) || !isNonEmptyString(password)) {
      throw new Error('El email y la contraseña son obligatorios');
    }
    const normalizedEmail = normalizeEmail(email);

    if (!isValidEmail(normalizedEmail)) {
      throw new Error('El email debe tener un formato valido');
    }

    const user = await database.getByEmail(normalizedEmail);

    if (!user) throw new Error(`Usuario no encontrado con email: ${email}`);

    const passwordValidated = await bcrypt.compare(password, user.password);

    if (!passwordValidated) {
      throw new Error('Password invalida');
    }
    
    const { password: _password, ...safeUser } = user;

    return safeUser;
  },
};
