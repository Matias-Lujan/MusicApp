-- Tabla canciones
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

--Tabla usuarios
create table public.users (
  id               uuid primary key default gen_random_uuid(),
  nombre           text not null,
  apellido         text not null,
  email            text not null unique,
  fecha_nacimiento date not null,
  password         text not null, -- hash bcrypt,
  role             text not null default 'USER',
  created_at       timestamp with time zone default now()
);

--Log de reproducciones por usuario y cancion
create table public.playback_log (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.users(id) on delete cascade,
  song_id         uuid not null references public.songs(id) on delete cascade,
  played_at       timestamp with time zone default now() not null
);


--Funcion para obtener Top global de reproducciones
create or replace function top_songs_global(limit_param integer)
returns table (
  song_id uuid,
  titulo text,
  artista text,
  album text,
  reproducciones bigint
) as $$
begin
  return query
  select
    pl.song_id,
    s.titulo,
    s.artista,
    s.album,
    count(*) as reproducciones
  from playback_log pl
  join songs s on s.id = pl.song_id
  group by pl.song_id, s.titulo, s.artista, s.album
  order by reproducciones desc
  limit limit_param;
end;
$$ language plpgsql stable;

select * from top_songs_global(5);


-- Funcion top reproducciones por usuario
create or replace function top_songs_by_user(
  user_uuid uuid,
  limit_param integer
)
returns table (
  song_id uuid,
  titulo text,
  artista text,
  album text,
  reproducciones bigint
) as $$
begin
  return query
  select
    pl.song_id,
    s.titulo,
    s.artista,
    s.album,
    count(*) as reproducciones
  from playback_log pl
  join songs s on s.id = pl.song_id
  where pl.user_id = user_uuid
  group by pl.song_id, s.titulo, s.artista, s.album
  order by reproducciones desc
  limit limit_param;
end;
$$ language plpgsql stable;

-- Funcion artista mas reproducido por usuario
create or replace function top_artists_by_user(
  user_uuid uuid,
  limit_param integer
)
returns table (
  artista text,
  reproducciones bigint
) as $$
begin
  return query
  select
    s.artista,
    count(*) as reproducciones
  from playback_log pl
  join songs s on s.id = pl.song_id
  where pl.user_id = user_uuid
  group by s.artista
  order by reproducciones desc
  limit limit_param;
end;
$$ language plpgsql stable;

-- Funcion top albums por usuario
create or replace function top_albums_by_user(
  user_uuid uuid,
  limit_param integer
)
returns table (
  album text,
  reproducciones bigint
) as $$
begin
  return query
  select
    s.album,
    count(*) as reproducciones
  from playback_log pl
  join songs s on s.id = pl.song_id
  where pl.user_id = user_uuid
  group by s.album
  order by reproducciones desc
  limit limit_param;
end;
$$ language plpgsql stable;

-- Funcion para obtener el top generos por usuario
create or replace function top_genres_by_user(
  user_uuid uuid,
  limit_param integer
)
returns table (
  genero text,
  reproducciones bigint
) as $$
begin
  return query
  select
    g as genero,
    count(*) as reproducciones
  from playback_log pl
  join songs s on s.id = pl.song_id
  cross join unnest(s.genero) as g
  where pl.user_id = user_uuid
  group by g
  order by reproducciones desc
  limit limit_param;
end;
$$ language plpgsql stable;
