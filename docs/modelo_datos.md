# 🗃️ Modelo de datos (Supabase + SQL)

El esquema de base de datos se encuentra documentado en `sql/init_db.sql`.

---

## 🎵 Tabla `songs`

```sql
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
```

**Descripción:**

- `id`: identificador único de la canción (UUID).
- `titulo`: título de la canción.
- `artista`: nombre del artista.
- `album`: álbum de la canción (si no se obtiene, `sin album`).
- `genero`: arreglo de géneros musicales (`text[]`), permite múltiples géneros por canción.
- `duracion`: duración en segundos.
- `portada`: URL de la imagen de portada (default `no disponible`).
- `fecha_lanzamiento`: fecha de lanzamiento del álbum desde Spotify.
- `created_at`: fecha/hora de creación del registro.

---

## 👤 Tabla `users`

```sql
create table public.users (
  id               uuid primary key default gen_random_uuid(),
  nombre           text not null,
  apellido         text not null,
  email            text not null unique,
  fecha_nacimiento date not null,
  password         text not null, -- hash bcrypt
  role             text not null default 'USER',
  created_at       timestamp with time zone default now()
);
```

**Descripción:**

- `id`: identificador único del usuario (UUID).
- `nombre`, `apellido`: datos personales.
- `email`: correo electrónico, único.
- `fecha_nacimiento`: usada para validar la mayoría de edad desde el backend.
- `password`: hash bcrypt de la contraseña (nunca se devuelve en responses).
- `role`: rol del usuario (`USER` o `ADMIN`, por defecto `USER`).
- `created_at`: fecha de creación.

---

## ▶️ Tabla `playback_log`

```sql
create table public.playback_log (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.users(id) on delete cascade,
  song_id         uuid not null references public.songs(id) on delete cascade,
  played_at       timestamp with time zone default now() not null
);
```

**Descripción:**

- `id`: identificador único del evento de reproducción.
- `user_id`: referencia al usuario que escuchó la canción.
- `song_id`: referencia a la canción reproducida.
- `played_at`: timestamp de la reproducción.

**Relaciones:**

- `user_id` → FK a `users(id)` con `on delete cascade`.
- `song_id` → FK a `songs(id)` con `on delete cascade`.

Si se borra un usuario o una canción, también se borran sus reproducciones asociadas.

---

## 📋 Tabla `playlists`

```sql
create table public.playlists (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.users(id) on delete cascade,
  nombre          text not null,
  descripcion     text,
  created_at      timestamp with time zone default now()
);
```

**Descripción:**

- `id`: identificador único de la playlist (UUID).
- `user_id`: referencia al usuario propietario de la playlist.
- `nombre`: nombre de la playlist.
- `descripcion`: descripción opcional de la playlist.
- `created_at`: fecha de creación.

**Relaciones:**

- `user_id` → FK a `users(id)` con `on delete cascade`.

Si se borra un usuario, también se borran todas sus playlists.

---

## 🎶 Tabla `playlist_songs`

```sql
create table public.playlist_songs (
  id              uuid primary key default gen_random_uuid(),
  playlist_id     uuid not null references public.playlists(id) on delete cascade,
  song_id         uuid not null references public.songs(id) on delete cascade,
  added_at        timestamp with time zone default now() not null,
  unique(playlist_id, song_id) -- Evita duplicados de canciones en la misma playlist
);
```

**Descripción:**

- `id`: identificador único de la relación (UUID).
- `playlist_id`: referencia a la playlist.
- `song_id`: referencia a la canción agregada.
- `added_at`: timestamp de cuándo se agregó la canción.
- `unique(playlist_id, song_id)`: constraint que evita agregar la misma canción dos veces a una playlist.

**Relaciones:**

- `playlist_id` → FK a `playlists(id)` con `on delete cascade`.
- `song_id` → FK a `songs(id)` con `on delete cascade`.

Si se borra una playlist o una canción, también se borran las relaciones correspondientes.

---

## 🔐 Tabla `refresh_tokens`

```sql
create table if not exists public.refresh_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  token_hash text not null unique,
  jti text not null unique,
  expires_at timestamp with time zone not null,
  revoked_at timestamp with time zone,
  replaced_by_jti text,
  created_at timestamp with time zone default now(),
  user_agent text,
  ip text
);

create index if not exists idx_refresh_tokens_user_id on public.refresh_tokens(user_id);
create index if not exists idx_refresh_tokens_expires_at on public.refresh_tokens(expires_at);

```

**Descripción:**

- `id`: Identificador único del refresh token (UUID).
- `user_id`: referencia al usuario propietario del refresh token.
- `token_hash`: hash del token para validación.
- `jti`: identificador único del token JWT.
- `expires_at`: fecha y hora de expiración del token.
- `revoked_at`: fecha y hora en que el token fue revocado (opcional).
- `replaced_by_jti`: JTI del token que reemplazó a este (opcional).
- `created_at`: fecha y hora de creación del token.
- `user_agent`: información del agente de usuario (navegador, app, etc.).
- `ip`: dirección IP desde donde se generó el token (asociada a la sesión).

**Índices:**

- `idx_refresh_tokens_user_id` → Optimiza búsquedas y revocaciones por usuario (logout global).
- `idx_refresh_tokens_expires_at` → Optimiza búsquedas y limpieza de tokens expirados.

**Relación con la seguridad del sistema:**

Esta tabla es utilizada por el flujo de autenticación para:
- emitir y persistir refresh tokens en `/api/auth/login`.
- renovar sesiones con rotación en `/api/auth/refresh`.
- revocar la sesión actual en `/api/auth/logout`.
- permitir la revocación de todas las sesiones de un usuario.

---

## 📊 Funciones SQL (RPC) para estadísticas

Todas estas funciones se definen en `sql/init_db.sql` y se consumen desde la API mediante `supabase.rpc(...)` en `stats.service.js`.

### 1️⃣ Top global de canciones — `top_songs_global`

```sql
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
```

Devuelve el top de canciones más reproducidas por todos los usuarios.

### 2️⃣ Top canciones por usuario — `top_songs_by_user`

```sql
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
```

### 3️⃣ Top artistas por usuario — `top_artists_by_user`

```sql
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
```

### 4️⃣ Top álbumes por usuario — `top_albums_by_user`

```sql
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
```

### 5️⃣ Top géneros por usuario — `top_genres_by_user`

```sql
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
```

**Nota:** se usa `unnest(s.genero)` para descomponer el arreglo de géneros en filas individuales.

---

## 💾 Nota sobre export a Excel

En el mismo archivo `sql/init_db.sql` se deja documentado un ejemplo de comando curl para descargar un XLSX desde el endpoint `/api/stats/export`.

```sql
/* para el xlsx con power shell:
curl.exe -H "Authorization: Bearer TOKEN" "http://127.0.0.1:3001/api/stats/export?limit=3" -o "exports/musicapp_stats_curl.xlsx"
*/
```