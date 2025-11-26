import express from 'express';
import { PlaylistController } from '../controllers/playlist.controllers.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const playlistRouter = express.Router();
const {
  getAll,
  getById,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  getSongs,
  addSong,
  removeSong,
} = PlaylistController;

// Todas las rutas requieren autenticación
playlistRouter.use(authMiddleware);

// Rutas principales de playlists
playlistRouter.get('/playlists', getAll);
playlistRouter.post('/create', createPlaylist);
playlistRouter.get('/:id', getById);
playlistRouter.patch('/:id', updatePlaylist);
playlistRouter.delete('/:id', deletePlaylist);

// Rutas para gestionar canciones en playlists
playlistRouter.get('/:id/songs', getSongs);
playlistRouter.post('/:id/songs', addSong);
playlistRouter.delete('/:id/songs/:songId', removeSong);

export default playlistRouter;
