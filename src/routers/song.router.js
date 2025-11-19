import express from 'express';
import { SongController } from '../controllers/song.controllers.js';

const songRouter = express.Router();
const { getAll, getById, deleteSong, createSong, updateSong } = SongController;

songRouter
  .get('/api/songs', getAll)
  .get('/api/song/:id', getById)
  .delete('/api/song/:id', deleteSong)
  .post('/api/song', createSong)
  .patch('/api/song/:id', updateSong);
export default songRouter;
