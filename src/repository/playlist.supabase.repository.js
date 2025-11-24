import DatabaseFactory from '../databases/DatabaseFactory.js';

export default class PlaylistRepositorySupabase {
  constructor() {
    this.init();
  }

  async init() {
    this.supabase = await DatabaseFactory.getConnection();
  }

  // Obtener todas las playlists de un usuario
  getAllByUserId = async (userId) => {
    const { data, error } = await this.supabase
      .from('playlists')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    return data;
  };

  // Obtener una playlist por ID
  getById = async (id) => {
    const { data, error } = await this.supabase
      .from('playlists')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);

    return data;
  };

  // Crear una nueva playlist
  createOne = async (playlistData) => {
    const { data, error } = await this.supabase
      .from('playlists')
      .insert([playlistData])
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data;
  };

  // Actualizar una playlist por ID
  updateOne = async (id, { nombre, descripcion }) => {
    const updateData = {};
    if (nombre !== undefined) updateData.nombre = nombre;
    if (descripcion !== undefined) updateData.descripcion = descripcion;

    const { data, error } = await this.supabase
      .from('playlists')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data;
  };

  // Eliminar una playlist por ID
  deleteOne = async (id) => {
    const { data, error } = await this.supabase
      .from('playlists')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data;
  };

  // Agregar una canción a una playlist
  addSongToPlaylist = async (playlistId, songId) => {
    const { data, error } = await this.supabase
      .from('playlist_songs')
      .insert([{ playlist_id: playlistId, song_id: songId }])
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data;
  };

  // Remover una canción de una playlist
  removeSongFromPlaylist = async (playlistId, songId) => {
    const { data, error } = await this.supabase
      .from('playlist_songs')
      .delete()
      .eq('playlist_id', playlistId)
      .eq('song_id', songId)
      .select();

    if (error) throw new Error(error.message);

    if (!data || data.length === 0) {
      return null;
    }

    return data[0];
  };

  // Obtener todas las canciones de una playlist
  getSongsByPlaylist = async (playlistId) => {
    const { data, error } = await this.supabase
      .from('playlist_songs')
      .select(
        `
        *,
        songs (
          id,
          titulo,
          artista,
          album,
          genero,
          duracion,
          portada,
          fecha_lanzamiento,
          created_at
        )
      `,
      )
      .eq('playlist_id', playlistId)
      .order('added_at', { ascending: true });

    if (error) throw new Error(error.message);

    return data;
  };

  // Verificar si una canción ya está en la playlist
  isSongInPlaylist = async (playlistId, songId) => {
    const { data, error } = await this.supabase
      .from('playlist_songs')
      .select('id')
      .eq('playlist_id', playlistId)
      .eq('song_id', songId)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 es el código cuando no se encuentra ningún resultado
      throw new Error(error.message);
    }

    return data !== null;
  };
}

