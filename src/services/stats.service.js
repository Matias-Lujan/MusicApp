import { RepositoryFactory } from '../repository/repositoryFactory.js';

const database = RepositoryFactory.getPlaybackRepository();

export const statsService = {
  async getTopSongsGlobal(limit) {
    return database.getTopSongsGlobal(limit);
  },

  async getTopSongsByUser(userId, limit) {
    return database.getTopSongsByUser(userId, limit);
  },

  async getTopArtistsByUser(userId, limit) {
    return database.getTopArtistsByUser(userId, limit);
  },

  async getTopAlbumsByUser(userId, limit) {
    return database.getTopAlbumsByUser(userId, limit);
  },

  async getTopGenresByUser(userId, limit) {
    return database.getTopGenresByUser(userId, limit);
  },

  async getAllStats(userId, limit) {
    const [topSongsGlobal, topSongsUser, topArtistsUser, topAlbumsUser, topGenresUser] =
      await Promise.all([
        this.getTopSongsGlobal(limit),
        this.getTopSongsByUser(userId, limit),
        this.getTopArtistsByUser(userId, limit),
        this.getTopAlbumsByUser(userId, limit),
        this.getTopGenresByUser(userId, limit),
      ]);

    return {
      topSongsGlobal,
      topSongsUser,
      topArtistsUser,
      topAlbumsUser,
      topGenresUser,
    };
  },
};
