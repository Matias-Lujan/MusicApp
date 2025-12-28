import { statsService } from '../services/stats.service.js';

export const StatsController = {
  async getTopSongsGlobal(req, res) {
    const limit = parseInt(req.query.limit) || 5;

    try {
      const data = await statsService.getTopSongsGlobal(limit);

      return res.status(200).json({
        status: 200,
        OK: true,
        message: `Top ${limit} canciones global obtenido correctamente`,
        payload: data,
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
  async getTopSongsByUser(req, res) {
    const limit = parseInt(req.query.limit) || 10;
    const userId = req.user.id; //viene mapeado en el middleware

    try {
      const data = await statsService.getTopSongsByUser(userId, limit);

      return res.status(200).json({
        status: 200,
        OK: true,
        message: `Top ${limit} canciones del usuario ${req.user.email} obtenidas correctamente`,
        payload: data,
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
  async getTopArtistsByUser(req, res) {
    const limit = parseInt(req.query.limit) || 10;
    const userId = req.user.id;

    try {
      const data = await statsService.getTopArtistsByUser(userId, limit);

      return res.status(200).json({
        status: 200,
        OK: true,
        message: `Top ${limit} artistas del usuario obtenidos correctamente`,
        payload: data,
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
  async getTopAlbumsByUser(req, res) {
    const limit = parseInt(req.query.limit) || 10;
    const userId = req.user.id;

    try {
      const data = await statsService.getTopAlbumsByUser(userId, limit);

      return res.status(200).json({
        status: 200,
        OK: true,
        message: `Top ${limit} albums del usuario obtenidos correctamente`,
        payload: data,
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
  async getTopGenresByUser(req, res) {
    const limit = parseInt(req.query.limit) || 10;
    const userId = req.user.id;

    try {
      const data = await statsService.getTopGenresByUser(userId, limit);

      return res.status(200).json({
        status: 200,
        OK: true,
        message: `Top ${limit} generos del usuario obtenidos correctamente`,
        payload: data,
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
