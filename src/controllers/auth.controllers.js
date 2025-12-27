import { userResponseDTO } from '../dto/userDTO.js';
import { authService } from '../services/auth.service.js';

export const AuthController = {
  login: async (req, res) => {
    console.log('LOGIN CONTROLLER EJECUTADO');
    const { email, password } = req.body;

    try {
      const { user, token } = await authService.loginUser({ email, password });

      res.status(200).json({
        status: 200,
        OK: true,
        token,
        payload: userResponseDTO(user),
        message: 'Login exitoso',
      });
    } catch (error) {
      const status = error.statusCode || 400;
      res.status(status).json({
        status,
        OK: false,
        message: error.message,
      });
    }
  },
};
