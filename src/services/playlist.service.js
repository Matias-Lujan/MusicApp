import { RepositoryFactory } from '../repository/repositoryFactory.js';

const playlistRepository = RepositoryFactory.getPlaylistRepository();
const songRepository = RepositoryFactory.getSongRepository();

function cleanObject(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== undefined));
}

export const playlistService = {
  async createPlaylist({ userId, nombre, descripcion }) {
    if (!nombre || nombre.trim() === '') {
      const error = new Error('El nombre de la playlist es requerido');
      error.statusCode = 400;
      throw error;
    }

    const playlistData = {
      user_id: userId,
      nombre: nombre.trim(),
      descripcion: descripcion?.trim() || null,
    };

    const playlist = await playlistRepository.createOne(playlistData);
    return playlist;
  },

  async getAllPlaylistsByUser(userId) {
    const playlists = await playlistRepository.getAllByUserId(userId);
    return playlists;
  },

  async getPlaylistById(playlistId, userId) {
    const playlist = await playlistRepository.getById(playlistId);

    if (!playlist) {
      const error = new Error('Playlist no encontrada');
      error.statusCode = 404;
      throw error;
    }

    // Verificar que el usuario sea el dueño de la playlist
    if (playlist.user_id !== userId) {
      const error = new Error('No tienes permiso para acceder a esta playlist');
      error.statusCode = 403;
      throw error;
    }

    return playlist;
  },

  async updatePlaylist(playlistId, userId, payload) {
    const playlist = await playlistRepository.getById(playlistId);

    if (!playlist) {
      const error = new Error('Playlist no encontrada');
      error.statusCode = 404;
      throw error;
    }

    // Verificar que el usuario sea el dueño de la playlist
    if (playlist.user_id !== userId) {
      const error = new Error('No tienes permiso para modificar esta playlist');
      error.statusCode = 403;
      throw error;
    }

    const dataToUpdate = cleanObject({
      nombre: payload.nombre,
      descripcion: payload.descripcion,
    });

    if (Object.keys(dataToUpdate).length === 0) {
      const error = new Error('No se enviaron campos para actualizar');
      error.statusCode = 400;
      throw error;
    }

    if (dataToUpdate.nombre !== undefined && dataToUpdate.nombre.trim() === '') {
      const error = new Error('El nombre de la playlist no puede estar vacío');
      error.statusCode = 400;
      throw error;
    }

    const updatedPlaylist = await playlistRepository.updateOne(playlistId, dataToUpdate);

    if (!updatedPlaylist) {
      const error = new Error('No se pudo actualizar la playlist');
      error.statusCode = 400;
      throw error;
    }

    return updatedPlaylist;
  },

  async deletePlaylist(playlistId, userId) {
    const playlist = await playlistRepository.getById(playlistId);

    if (!playlist) {
      const error = new Error('Playlist no encontrada');
      error.statusCode = 404;
      throw error;
    }

    // Verificar que el usuario sea el dueño de la playlist
    if (playlist.user_id !== userId) {
      const error = new Error('No tienes permiso para eliminar esta playlist');
      error.statusCode = 403;
      throw error;
    }

    const deletedPlaylist = await playlistRepository.deleteOne(playlistId);

    if (!deletedPlaylist) {
      const error = new Error('No se pudo eliminar la playlist');
      error.statusCode = 400;
      throw error;
    }

    return deletedPlaylist;
  },

  async addSongToPlaylist(playlistId, songId, userId) {
    // Verificar que la playlist existe y pertenece al usuario
    const playlist = await playlistRepository.getById(playlistId);

    if (!playlist) {
      const error = new Error('Playlist no encontrada');
      error.statusCode = 404;
      throw error;
    }

    if (playlist.user_id !== userId) {
      const error = new Error('No tienes permiso para modificar esta playlist');
      error.statusCode = 403;
      throw error;
    }

    // Verificar que la canción existe
    const song = await songRepository.getById(songId);

    if (!song) {
      const error = new Error('Canción no encontrada');
      error.statusCode = 404;
      throw error;
    }

    // Verificar si la canción ya está en la playlist
    const isAlreadyAdded = await playlistRepository.isSongInPlaylist(playlistId, songId);

    if (isAlreadyAdded) {
      const error = new Error('La canción ya está en la playlist');
      error.statusCode = 400;
      throw error;
    }

    const result = await playlistRepository.addSongToPlaylist(playlistId, songId);
    return result;
  },

  async removeSongFromPlaylist(playlistId, songId, userId) {
    // Verificar que la playlist existe y pertenece al usuario
    const playlist = await playlistRepository.getById(playlistId);

    if (!playlist) {
      const error = new Error('Playlist no encontrada');
      error.statusCode = 404;
      throw error;
    }

    if (playlist.user_id !== userId) {
      const error = new Error('No tienes permiso para modificar esta playlist');
      error.statusCode = 403;
      throw error;
    }

    const result = await playlistRepository.removeSongFromPlaylist(playlistId, songId);

    if (!result) {
      const error = new Error('La canción no está en la playlist');
      error.statusCode = 404;
      throw error;
    }

    return result;
  },

  async getSongsByPlaylist(playlistId, userId) {
    // Verificar que la playlist existe y pertenece al usuario
    const playlist = await playlistRepository.getById(playlistId);

    if (!playlist) {
      const error = new Error('Playlist no encontrada');
      error.statusCode = 404;
      throw error;
    }

    if (playlist.user_id !== userId) {
      const error = new Error('No tienes permiso para acceder a esta playlist');
      error.statusCode = 403;
      throw error;
    }

    const songs = await playlistRepository.getSongsByPlaylist(playlistId);
    return songs;
  },
};

