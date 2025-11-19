import { createClient } from '@supabase/supabase-js';
import { config } from './src/config/config.js';


// variables desde .env
const supabase = createClient(
  config.SUPABASE_URL,
  config.SUPABASE_API_KEY
);

const testConnection = async () => {
  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .limit(1);

  if (error) {
    console.error('❌ Error conectando a Supabase:', error.message);
    return;
  }

  console.log('✅ Conexión exitosa! Primer registro:', data);
};

testConnection();