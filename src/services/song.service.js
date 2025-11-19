import { RepositoryFactory } from '../repository/repositoryFactory.js';
import { fetchDataSpotify } from './external/spotify.service.js';

const database = RepositoryFactory.getRepository();

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
};
