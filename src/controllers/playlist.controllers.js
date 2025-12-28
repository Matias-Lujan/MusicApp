import {
  playlistListResponseDTO,
  playlistResponseDTO,
  playlistWithSongsResponseDTO,
} from '../dto/playlistDTO.js';
import { playlistService } from '../services/playlist.service.js';

export const PlaylistController = {
  getAll: async (req, res) => {
    try {
      const { id: userId, role } = req.user;

      const playlists = await playlistService.getAllPlaylists(userId, role);

      if (playlists.length === 0) {
        return res.status(200).json({
          status: 200,
          OK: true,
          message:
            role === 'ADMIN'
              ? 'No hay playlists creadas aún en el sistema'
              : 'No tienes playlists creadas aún',
          payload: [],
        });
      }

      res.json({
        status: 200,
        OK: true,
        payload: playlistListResponseDTO(playlists),
      });
    } catch (error) {
      console.log('Error al obtener las playlists', error.message);
      const status = error.statusCode || 500;
      res.status(status).json({
        status,
        OK: false,
        message: error.message || 'Error interno del servidor',
      });
    }
  },

  getById: async (req, res) => {
    const { id } = req.params;
    const { id: userId, role } = req.user;

    try {
      const playlist = await playlistService.getPlaylistById(id, userId, role);
      res.status(200).json({
        status: 200,
        OK: true,
        message: 'Playlist encontrada',
        payload: playlistResponseDTO(playlist),
      });
    } catch (error) {
      const status = error.statusCode || 400;
      res.status(status).json({
        status,
        OK: false,
        message: error.message,
      });
    }
  },

  createPlaylist: async (req, res) => {
    const { nombre, descripcion } = req.body;
    const userId = req.user.id;

    try {
      const playlist = await playlistService.createPlaylist({
        userId,
        nombre,
        descripcion,
      });

      res.status(200).json({
        status: 200,
        OK: true,
        message: 'Playlist creada',
        payload: playlistResponseDTO(playlist),
      });
    } catch (error) {
      const status = error.statusCode || 400;
      res.status(status).json({
        status,
        OK: false,
        message: error.message,
      });
    }
  },

  updatePlaylist: async (req, res) => {
    const { id } = req.params;
    const { id: userId, role } = req.user;

    try {
      const playlist = await playlistService.updatePlaylist(id, userId, role, req.body);

      res.status(200).json({
        status: 200,
        OK: true,
        message: 'Playlist actualizada',
        payload: playlistResponseDTO(playlist),
      });
    } catch (error) {
      const status = error.statusCode || 400;
      res.status(status).json({
        status,
        OK: false,
        message: error.message,
      });
    }
  },

  deletePlaylist: async (req, res) => {
    const { id } = req.params;
    const { id: userId, role } = req.user;

    try {
      const playlist = await playlistService.deletePlaylist(id, userId, role);

      res.status(200).json({
        status: 200,
        OK: true,
        message: `Playlist ID -> ${id} eliminada`,
        payload: playlistResponseDTO(playlist),
      });
    } catch (error) {
      const status = error.statusCode || 400;
      res.status(status).json({
        status,
        OK: false,
        message: error.message,
      });
    }
  },

  getSongs: async (req, res) => {
    const { id } = req.params;
    const { id: userId, role } = req.user;

    try {
      const playlist = await playlistService.getPlaylistById(id, userId, role);
      const songs = await playlistService.getSongsByPlaylist(id, userId, role);

      res.status(200).json({
        status: 200,
        OK: true,
        payload: playlistWithSongsResponseDTO(playlist, songs),
      });
    } catch (error) {
      const status = error.statusCode || 400;
      res.status(status).json({
        status,
        OK: false,
        message: error.message,
      });
    }
  },

  addSong: async (req, res) => {
    const { id } = req.params;
    const { songId } = req.body;
    const { id: userId, role } = req.user;

    try {
      await playlistService.addSongToPlaylist(id, songId, userId, role);

      res.status(200).json({
        status: 200,
        OK: true,
        message: 'Canción agregada a la playlist',
      });
    } catch (error) {
      const status = error.statusCode || 400;
      res.status(status).json({
        status,
        OK: false,
        message: error.message,
      });
    }
  },

  removeSong: async (req, res) => {
    const { id, songId } = req.params;
    const { id: userId, role } = req.user;

    try {
      await playlistService.removeSongFromPlaylist(id, songId, userId, role);

      res.status(200).json({
        status: 200,
        OK: true,
        message: 'Canción eliminada de la playlist',
      });
    } catch (error) {
      const status = error.statusCode || 400;
      res.status(status).json({
        status,
        OK: false,
        message: error.message,
      });
    }
  },
};
