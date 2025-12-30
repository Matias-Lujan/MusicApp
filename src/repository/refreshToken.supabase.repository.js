import DatabaseFactory from '../databases/DatabaseFactory.js';

export default class RefreshTokenRepositorySupabase {
  constructor() {
    this.init();
  }

  async init() {
    this.supabase = await DatabaseFactory.getConnection();
  }

  insertRefreshToken = async (row) => {
    const { data, error } = await this.supabase
      .from('refresh_tokens')
      .insert(row)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  };

  findByHash = async (tokenHash) => {
    const { data, error } = await this.supabase
      .from('refresh_tokens')
      .select('*')
      .eq('token_hash', tokenHash)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data;
  };

  revokeByHash = async (tokenHash) => {
    const { error } = await this.supabase
      .from('refresh_tokens')
      .update({ revoked_at: new Date().toISOString() })
      .eq('token_hash', tokenHash)
      .is('revoked_at', null);

    if (error) throw new Error(error.message);
  };

  revokeAndReplace = async ({ oldTokenHash, replacedByJti }) => {
    const { error } = await this.supabase
      .from('refresh_tokens')
      .update({
        revoked_at: new Date().toISOString(),
        replaced_by_jti: replacedByJti,
      })
      .eq('token_hash', oldTokenHash)
      .is('revoked_at', null);

    if (error) throw new Error(error.message);
  };

  revokeAllForUser = async (userId) => {
    const { error } = await this.supabase
      .from('refresh_tokens')
      .update({ revoked_at: new Date().toISOString() })
      .eq('user_id', userId)
      .is('revoked_at', null);

    if (error) throw new Error(error.message);
  };
}
