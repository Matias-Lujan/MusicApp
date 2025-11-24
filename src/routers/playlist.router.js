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
playlistRouter.post('/playlists', createPlaylist);
playlistRouter.get('/playlists/:id', getById);
playlistRouter.patch('/playlists/:id', updatePlaylist);
playlistRouter.delete('/playlists/:id', deletePlaylist);

// Rutas para gestionar canciones en playlists
playlistRouter.get('/playlists/:id/songs', getSongs);
playlistRouter.post('/playlists/:id/songs', addSong);
playlistRouter.delete('/playlists/:id/songs/:songId', removeSong);

export default playlistRouter;

