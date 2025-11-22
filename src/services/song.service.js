import { RepositoryFactory } from '../repository/repositoryFactory.js';
import { fetchDataSpotify } from './external/spotify.service.js';

const database = RepositoryFactory.getSongRepository();

function cleanObject(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== undefined));
}

export const songService = {
  async createSong({ titulo, artista }) {
    const spotifyData = await fetchDataSpotify(titulo, artista);

    const song = {
      titulo,
      artista,
      album: spotifyData.albumName ?? 'sin album',
      genero: spotifyData.genres?.length ? spotifyData.genres : ['Sin género'],
      duracion: spotifyData.durationSeg ?? 0,
      portada: spotifyData.cover ?? 'no disponible',
      fecha_lanzamiento: spotifyData.albumReleaseDate ?? null,
    };

    const songCreated = await database.createOne(song);
    return songCreated;
  },

  async updateSongById(id, payload) {
    const song = await database.getById(id);

    if (!song) {
      const error = new Error('Canción no encontrada');
      error.statusCode = 404;
      throw error;
    }

    const oldDataSong = { ...song };

    const dataToUpdate = cleanObject({
      titulo: payload.titulo,
      artista: payload.artista,
      album: payload.album,
      genero: payload.genero,
      duracion: payload.duracion,
      portada: payload.portada,
      fecha_lanzamiento: payload.fecha_lanzamiento,
    });

    if (Object.keys(dataToUpdate).length === 0) {
      const error = new Error('No se enviaron campos para actualizar');
      error.statusCode = 400;
      throw error;
    }

    const newDataSong = await database.updateOne(id, dataToUpdate);

    if (!newDataSong) {
      const error = new Error('No se pudo actualizar la canción');
      error.statusCode = 400;
      throw error;
    }

    return { oldDataSong, newDataSong };
  },

  async deleteSongById(id) {
    const song = await database.getById(id);

    if (!song) {
      const error = new Error('Canción no encontrada');
      error.statusCode = 404;
      throw error;
    }

    const deletedSong = await database.deleteOne(id);

    if (!deletedSong) {
      const error = new Error('No se pudo eliminar la canción');
      error.statusCode = 400;
      throw error;
    }

    return deletedSong;
  },
};
