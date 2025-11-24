import express from 'express';
import { SongController } from '../controllers/song.controllers.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { isAdmin } from '../middleware/admin.middleware.js';
import { PlaybackController } from '../controllers/playback.controllers.js';

const songRouter = express.Router();
const { getAll, getById, deleteSong, createSong, updateSong } = SongController;
const { playSong } = PlaybackController;

//estar logueado
songRouter.use(authMiddleware);

songRouter.get('/songs', getAll);
songRouter.post('/play/:id', playSong);
songRouter.get('/:id', getById);

songRouter
  //ser admin
  .delete('/:id', isAdmin, deleteSong)
  .post('/create', isAdmin, createSong)
  .patch('/:id', isAdmin, updateSong);
export default songRouter;
