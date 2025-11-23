import { userResponseDTO } from '../dto/userDTO.js';
import { authService } from '../services/auth.service.js';

export const AuthController = {
  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      const { user, token } = await authService.loginUser({ email, password });

      res.json({
        status: 200,
        OK: true,
        token,
        payload: userResponseDTO(user),
        message: 'Login exitoso',
      });
    } catch (error) {
      res.json({
        status: 400,
        OK: false,
        message: error.message,
      });
    }
  },
};
