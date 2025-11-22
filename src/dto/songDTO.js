import { toCamelCase, toTitleCase } from '../utils/string.utils.js';
/**
 * Normaliza una canción individual
 */
export const songResponseDTO = (song) => {
  if (!song) return null;

  return {
    id: song.id,
    titulo: toTitleCase(song.titulo),
    artista: toTitleCase(song.artista),
    album: toTitleCase(song.album),
    genero: toTitleCase(song.genero),
    duracion: formatDuration(song.duracion),
    fechaLanzamiento: song.fecha_lanzamiento,
    portada: song.portada,
    //created_at: song.created_at,
  };
};

/**
 * Normaliza un array completo de canciones
 */
export const songListResponseDTO = (songs = []) => {
  return songs.map((song) => songResponseDTO(song));
};

// Función para convertir segundos a mm:ss
const formatDuration = (seconds) => {
  if (typeof seconds !== 'number' || seconds < 0) return '00:00';

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  // Aseguramos formato 2 dígitos
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};
