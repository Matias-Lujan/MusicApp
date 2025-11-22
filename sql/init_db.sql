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

create table public.users (
  id               uuid primary key default gen_random_uuid(),
  nombre           text not null,
  apellido         text not null,
  email            text not null unique,
  fecha_nacimiento date not null,
  password         text not null, -- hash bcrypt
  created_at       timestamp with time zone default now()
);

create table public.playback_log (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.users(id) on delete cascade,
  song_id         uuid not null references public.songs(id) on delete cascade,
  played_at       timestamp with time zone default now() not null
);