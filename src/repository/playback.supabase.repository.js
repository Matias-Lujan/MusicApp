import DatabaseFactory from '../databases/DatabaseFactory.js';

export default class PlaybackRepositorySupabase {
  constructor() {
    this.init();
  }

  async init() {
    this.supabase = await DatabaseFactory.getConnection();
  }

  createOne = async ({ userId, songId, playedAt }) => {
    const payload = {
      user_id: userId,
      song_id: songId,
    };

    // cargar reproducciones pasadas para tests
    if (playedAt) {
      payload.played_at = playedAt;
    }

    const { data, error } = await this.supabase
      .from('playback_log')
      .insert([payload])
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data;
  };

  getTopSongsGlobal = async (limit) => {
    const { data, error } = await this.supabase.rpc('top_songs_global', {
      limit_param: limit,
    });

    if (error) throw new Error(error.message);

    return data;
  };

  getTopSongsByUser = async (userId, limit) => {
    const { data, error } = await this.supabase.rpc('top_songs_by_user', {
      user_uuid: userId,
      limit_param: limit,
    });

    if (error) throw new Error(error.message);

    return data;
  };

  getTopArtistsByUser = async (userId, limit) => {
    const { data, error } = await this.supabase.rpc('top_artists_by_user', {
      user_uuid: userId,
      limit_param: limit,
    });

    if (error) throw new Error(error.message);

    return data;
  };

  getTopAlbumsByUser = async (userId, limit) => {
    const { data, error } = await this.supabase.rpc('top_albums_by_user', {
      user_uuid: userId,
      limit_param: limit,
    });

    if (error) throw new Error(error.message);

    return data;
  };

  getTopGenresByUser = async (userId, limit) => {
    const { data, error } = await this.supabase.rpc('top_genres_by_user', {
      user_uuid: userId,
      limit_param: limit,
    });

    if (error) throw new Error(error.message);

    return data;
  };
}
