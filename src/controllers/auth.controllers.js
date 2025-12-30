import { userResponseDTO } from '../dto/userDTO.js';
import { authService } from '../services/auth.service.js';

export const AuthController = {
  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      const meta = { userAgent: req.headers['user-agent'], ip: req.ip }; // Obtener metadata del request: user-agent= navegador, sistema operativo, aplicación cliente; ip= dirección IP del cliente
      const { user, accessToken, refreshToken } = await authService.loginUser({
        email,
        password,
        meta,
      });
      console.log(user);
      res.status(200).json({
        status: 200,
        OK: true,
        accessToken,
        refreshToken,
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
