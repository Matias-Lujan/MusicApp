create table public.songs (
  id               uuid primary key default gen_random_uuid(),
  titulo           text not null,
  artista          text not null,
  album            text default 'sin album',
  genero           text[] not null,           -- array de géneros
  duracion         integer not null,          -- en segundos
  portada          text default 'no disponible',
  fecha_lanzamiento date,                     -- basada en el álbum de Spotify
  created_at       timestamp with time zone default now()
);

-- 1) Canción con todos los campos mínimos
insert into songs (titulo, artista, genero, duracion)
values (
  'Numb',
  'Linkin Park',
  '{Rock, Alternative}',
  185
);

-- 2) Canción con portada personalizada pero album por defecto
insert into songs (titulo, artista, genero, duracion, portada)
values (
  'Blinding Lights',
  'The Weeknd',
  '{Pop, Synthwave}',
  200,
  'https://example.com/blinding-lights.jpg'
);

-- 3) Canción con descripción personalizada
insert into songs (titulo, artista, genero, duracion, descripcion)
values (
  'Shape of You',
  'Ed Sheeran',
  '{Pop}',
  234,
  'Uno de los éxitos más grandes de 2017'
);

-- 4) Canción con letra incluida (resto por defecto)
insert into songs (titulo, artista, genero, duracion, letra)
values (
  'Bohemian Rhapsody',
  'Queen',
  '{Rock}',
  354,
  'Is this the real life? Is this just fantasy?...'
);

-- 5) Canción completando 2 o 3 campos pero dejando defaults
insert into songs (titulo, artista, genero, duracion, album)
values (
  'HUMBLE.',
  'Kendrick Lamar',
  '{Hip-Hop}',
  177,
  'DAMN.'
);