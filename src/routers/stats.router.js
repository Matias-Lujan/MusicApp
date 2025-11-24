import express from 'express';
import { StatsController } from '../controllers/stats.controllers.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const {
  getTopSongsGlobal,
  getTopSongsByUser,
  getTopArtistsByUser,
  getTopAlbumsByUser,
  getTopGenresByUser,
} = StatsController;
const statsRouter = express.Router();

// estar logueado
statsRouter.use(authMiddleware);

//global
statsRouter.get('/top-songs', getTopSongsGlobal);
//por usuario
statsRouter.get('/me/top-songs', getTopSongsByUser);
statsRouter.get('/me/top-artists', getTopArtistsByUser);
statsRouter.get('/me/top-albums', getTopAlbumsByUser);
statsRouter.get('/me/top-genres', getTopGenresByUser);

export default statsRouter;
