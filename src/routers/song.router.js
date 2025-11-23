import express from 'express';
import { SongController } from '../controllers/song.controllers.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { isAdmin } from '../middleware/admin.middleware.js';

const songRouter = express.Router();
const { getAll, getById, deleteSong, createSong, updateSong } = SongController;

//estar logueado
songRouter.use(authMiddleware);

songRouter
  .get('/songs', getAll)
  .get('/:id', getById)
  //ser admin
  .delete('/:id', isAdmin, deleteSong)
  .post('/create', isAdmin, createSong)
  .patch('/:id', isAdmin, updateSong);
export default songRouter;
