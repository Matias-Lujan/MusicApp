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
}
