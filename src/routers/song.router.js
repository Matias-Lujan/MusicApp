import express from 'express';
import { SongController } from '../controllers/song.controllers.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const songRouter = express.Router();
const { getAll, getById, deleteSong, createSong, updateSong } = SongController;


songRouter.use(authMiddleware);

songRouter
  .get('/songs', getAll)
  .get('/:id', getById)
  .delete('/:id', deleteSong)
  .post('/create', createSong)
  .patch('/:id', updateSong);
export default songRouter;
