import { userResponseDTO } from '../dto/userDTO.js';
import { authService } from '../services/auth.service.js';


export const AuthController = {
  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      const data = await authService.loginUser({ email, password });

      res.json({
        status: 200,
        OK: true,
        payload: userResponseDTO(data),
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
