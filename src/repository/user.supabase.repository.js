import DatabaseFactory from '../databases/DatabaseFactory.js';

export default class UserRepositorySupabase {
  constructor() {
    this.init();
  }

  async init() {
    this.supabase = await DatabaseFactory.getConnection();
  }

  // Obtener todos los usuarios
  async getAll() {
    const { data, error } = await this.supabase.from('users').select('*');

    if (error) throw new Error(error.message);

    return data;
  }

  // Obtener un usuario por ID
  getById = async (id) => {
    const { data, error } = await this.supabase.from('users').select('*').eq('id', id);

    if (error) throw new Error(error.message);

    return data && data.length > 0 ? data[0] : null;
  };

  // Crear un nuevo usuario
  createOne = async (userData) => {
    const { data, error } = await this.supabase.from('users').insert([userData]).select().single();

    if (error) throw new Error(error.message);

    return data;
  };

  // Actualizar un usuario por ID
  updateOne = async (id, updatedFields) => {
    const { data, error } = await this.supabase
      .from('users')
      .update(updatedFields)
      .eq('id', id)
      .select();

    if (error) throw new Error(error.message);

    return data && data.length > 0 ? data[0] : null;
  };

  // Eliminar un usuario por ID
  deleteOne = async (id) => {
    const { data, error } = await this.supabase
      .from('users')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data;
  };

  //devuelve el objeto usuario completo (incluyendo password hash) si existe sino un null
  async getByEmail(email) {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle(); // devuelve 0 o 1 fila

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
}
