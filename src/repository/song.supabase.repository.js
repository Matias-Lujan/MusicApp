import DatabaseFactory from '../databases/DatabaseFactory.js';

export default class SongRepositorySupabase {
  constructor() {
    this.init();
  }

  async init() {
    this.supabase = await DatabaseFactory.getConnection();
  }

  // Obtener todas las canciones
  async getAll() {
    const { data, error } = await this.supabase.from('songs').select('*');

    if (error) throw new Error(error.message);

    return data;
  }

  // Obtener una cancion por ID
  getById = async (id) => {
    const { data, error } = await this.supabase.from('songs').select('*').eq('id', id); //.single();

    if (error) throw new Error(error.message);

    return data && data.length > 0 ? data[0] : null;
  };

  // Crear una nuevo cancion
  createOne = async (songData) => {
    const { data, error } = await this.supabase.from('songs').insert([songData]).select().single();

    if (error) throw new Error(error.message);

    return data;
  };

  // Actualizar una cancion por ID
  updateOne = async (
    id,
    { titulo, artista, album, genero, duracion, portada, fecha_lanzamiento },
  ) => {
    const { data, error } = await this.supabase
      .from('songs')
      .update({
        titulo,
        artista,
        album,
        genero,
        duracion,
        portada,
        fecha_lanzamiento,
      })
      .eq('id', id)
      .select();
    //.single();

    if (error) throw new Error(error.message);

    return data && data.length > 0 ? data[0] : null;
  };

  // Eliminar una cancion por ID
  deleteOne = async (id) => {
    const { data, error } = await this.supabase
      .from('songs')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    console.log(data);
    return data;
  };
}
