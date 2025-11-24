import { toTitleCase } from '../utils/string.utils.js';
import { songResponseDTO } from './songDTO.js';

/**
 * Normaliza una playlist individual
 */
export const playlistResponseDTO = (playlist) => {
  if (!playlist) return null;

  return {
    id: playlist.id,
    nombre: toTitleCase(playlist.nombre),
    descripcion: playlist.descripcion ? toTitleCase(playlist.descripcion) : null,
    createdAt: playlist.created_at,
  };
};

/**
 * Normaliza un array completo de playlists
 */
export const playlistListResponseDTO = (playlists = []) => {
  return playlists.map((playlist) => playlistResponseDTO(playlist));
};

/**
 * Normaliza una playlist con sus canciones
 */
export const playlistWithSongsResponseDTO = (playlist, songs = []) => {
  if (!playlist) return null;

  const normalizedSongs = songs.map((playlistSong) => {
    if (playlistSong.songs) {
      return {
        ...songResponseDTO(playlistSong.songs),
        addedAt: playlistSong.added_at,
      };
    }
    return null;
  }).filter(Boolean);

  return {
    ...playlistResponseDTO(playlist),
    canciones: normalizedSongs,
    totalCanciones: normalizedSongs.length,
  };
};

