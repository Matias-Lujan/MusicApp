import { RepositoryFactory } from '../repository/repositoryFactory.js';

const songRepository = RepositoryFactory.getSongRepository();
const playbackRepository = RepositoryFactory.getPlaybackRepository();

export const playbackService = {
  async playSong({ userId, songId }) {
    const song = await songRepository.getById(songId);

    if (!song) {
      const error = new Error('Cancion no encontrada');
      error.statusCode = 404;
      throw error;
    }

    const log = await playbackRepository.createOne({ userId, songId });

    if (!log) {
      const error = new Error('No se pudo registrar la reproduccion');
      error.statusCode = 400;
      throw error;
    }

    return {
      message: 'Reproduccion registrada',
      song,
      log,
    };
  },
};
