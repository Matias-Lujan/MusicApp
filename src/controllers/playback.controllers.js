import { playbackService } from '../services/playback.service.js';

export const PlaybackController = {
  playSong: async (req, res) => {
    const { id: songId } = req.params;
    const userId = req.user?.id;

    console.log(`Reproduccion realizada -> songId: ${songId}, userId: ${userId}`);

    if (!userId) {
      return res.status(401).json({
        status: 401,
        OK: false,
        message: 'Usuario no autenticado',
      });
    }

    try {
      const { message, song, log } = await playbackService.playSong({ userId, songId });

      return res.json({
        status: 201,
        OK: true,
        message,
        payload: {
          song,
          log,
        },
      });
    } catch (error) {
      const status = error.statusCode || 400;

      return res.status(status).json({
        status,
        OK: false,
        message: error.message,
      });
    }
  },
};
