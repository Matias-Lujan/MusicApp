# 🌐 Endpoints de la API

Este documento detalla todos los endpoints disponibles en la API de MusicApp, incluyendo métodos, accesos, ejemplos de request/response y requisitos de autenticación.

---

Todos los endpoints (excepto `login`) requieren:

- Header `Authorization: Bearer <token>` válido.

Algunas rutas además requieren rol `ADMIN`.

---

## 📘 Documentación de API (Swagger)

La API incluye documentación interactiva mediante **Swagger UI**.

### GET `/api/docs`

**Acceso:** Público

**Descripción:**  
Muestra la documentación completa de todos los endpoints, incluyendo:

- parámetros de entrada
- respuestas esperadas
- ejemplos
- modelos de datos
- códigos de error
- autenticación con JWT para probar endpoints protegidos

Ideal para explorar y probar la API sin herramientas externas.

---

## 🔐 AUTH

### POST `/api/auth/login`

**Acceso:** Público

**Descripción:**  
Autentica un usuario a partir de `email` y `password`, e inicia una sesión segura basada en JWT.

**Body:**

```json
{
  "email": "user@mail.com",
  "password": "12345678"
}
```

**Respuesta (200):**

```json
{
  "status": 200,
  "OK": true,
  "access_token": "<access_token>",
  "refresh_token": "<refresh_token>",
  "payload": {
    "id": "...",
    "nombre": "...",
    "apellido": "...",
    "email": "...",
    "role": "USER"
  },
  "message": "Login exitoso"
}
```

---

## 🔐 AUTH

### POST `/api/auth/refresh`

**Acceso:** Público (requiere refresh token)

**Descripción:**  
Renueva el access token utilizando un refresh token válido.

**Características:**
Aplica rotación de refresh token.

El refresh token anterior queda automáticamente revocado.

**Errores posibles:**
401 → Refresh token inválido, expirado o revocado.

---

## 🔐 AUTH

### POST `/api/auth/logout`

**Acceso:** USER / ADMIN

**Descripción:**  
Cierra la sesión actual invalidando el refresh token asociado.

**Resultado:**
El refresh token queda revocado.

La sesión no puede renovarse nuevamente.

---

## 👤 USERS

### GET `/api/user/all`

**Acceso:** USER / ADMIN

**Descripción:** Devuelve el listado completo de usuarios.

### GET `/api/user/:id`

**Acceso:** USER / ADMIN

**Descripción:** Devuelve un usuario por su id.

**Respuesta (caso éxito):**

```json
{
  "status": 200,
  "OK": true,
  "message": "Existe el usuario",
  "payload": {
    "id": "...",
    "nombre": "...",
    "apellido": "...",
    "email": "...",
    "role": "USER"
  }
}
```

### POST `/api/user/create`

**Acceso:** ADMIN

**Descripción:** Crea un nuevo usuario.

**Body:**

```json
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan@ejemplo.com",
  "fecha_nacimiento": "1990-01-01",
  "password": "12345678",
  "role": "USER"
}
```

### PATCH `/api/user/:id`

**Acceso:** ADMIN

**Descripción:** Actualiza datos de un usuario existente (parcialmente).

**Ejemplo de body:**

```json
{
  "nombre": "Juan Actualizado",
  "role": "ADMIN"
}
```

### DELETE `/api/user/:id`

**Acceso:** ADMIN

**Descripción:** Elimina un usuario por su id.

---

## 🎵 SONGS

Todos los endpoints de `/api/song` requieren autenticación.
Solo ADMIN puede crear / modificar / eliminar canciones.

### GET `/api/song/songs`

**Acceso:** USER / ADMIN

Lista todas las canciones.

### GET `/api/song/:id`

**Acceso:** USER / ADMIN

Devuelve una canción por su id.

**Respuesta (ejemplo):**

```json
{
  "status": 200,
  "OK": true,
  "message": "Existe la cancion",
  "playload": {
    "id": "...",
    "titulo": "...",
    "artista": "...",
    "album": "...",
    "genero": ["Pop"],
    "duracion": "03:25",
    "portada": "https://...",
    "fecha_lanzamiento": "2020-01-01"
  }
}
```

### POST `/api/song/create`

**Acceso:** ADMIN

**Descripción:**
Crea una canción indicando solo titulo y artista.
El servicio se encarga de consultar Spotify y completar el resto de los campos.

**Body:**

```json
{
  "titulo": "Numb",
  "artista": "Linkin Park"
}
```

### PATCH `/api/song/:id`

**Acceso:** ADMIN

Actualiza campos de una canción (parcialmente).

### DELETE `/api/song/:id`

**Acceso:** ADMIN

Elimina una canción por id.

---

## ▶️ PLAYBACK (Reproducciones)

### POST `/api/song/play/:id`

**Acceso:** USER / ADMIN

**Descripción:**
Registra una reproducción de la canción con id = `:id`, vinculada al usuario del token.

El `user_id` se obtiene de `req.user.id`, cargado por el authMiddleware.

**Respuesta (ejemplo):**

```json
{
  "status": 200,
  "OK": true,
  "message": "Reproducción registrada",
  "payload": {
    "id": "uuid_playback",
    "user_id": "uuid_usuario",
    "song_id": "uuid_song",
    "played_at": "2025-11-24T..."
  }
}
```

## 🎧 PLAYLISTS

Todos los endpoints de `/api/playlist` requieren token JWT.  
Cada playlist pertenece al usuario autenticado.

---

## POST `/api/playlist/create`

**Acceso:** USER / ADMIN

**Descripción:** Crea una nueva playlist para el usuario del token.

**Body:**

```json
{
  "nombre": "Gym Hits",
  "descripcion": "Música para entrenar"
}
```

**Respuesta (201):**

```json
{
  "status": 201,
  "OK": true,
  "message": "Playlist creada",
  "payload": {
    "id": "...",
    "nombre": "Gym Hits",
    "descripcion": "Música para entrenar"
  }
}
```

---

## GET `/api/playlist/my`

**Acceso:** USER / ADMIN

**Descripción:** Devuelve todas las playlists creadas por el usuario del token.

---

## DELETE `/api/playlist/:id`

**Acceso:** USER / ADMIN

**Restricción:** Solo puede eliminar playlists propias.

**Descripción:** Elimina una playlist por su id.

---

## POST `/api/playlist/:id/add/:songId`

**Acceso:** USER / ADMIN

**Descripción:** Agrega una canción a la playlist. Evita duplicados gracias a la constraint `unique(playlist_id, song_id)`.

**Respuesta (ejemplo):**

```json
{
  "status": 200,
  "OK": true,
  "message": "Canción agregada a la playlist"
}
```

---

## DELETE `/api/playlist/:id/remove/:songId`

**Acceso:** USER / ADMIN

**Descripción:** Quita una canción de una playlist.

---

## GET `/api/playlist/:id/songs`

**Acceso:** USER / ADMIN

**Descripción:** Devuelve todas las canciones dentro de una playlist.

**Respuesta (ejemplo):**

```json
[
  {
    "song_id": "...",
    "titulo": "Numb",
    "artista": "Linkin Park",
    "album": "Meteora"
  }
]
```

---

## 📊 STATS

Todos los endpoints de `/api/stats` requieren token.

### GET `/api/stats/top-songs?limit=10`

**Descripción:**
Devuelve el top de canciones más reproducidas globalmente (todos los usuarios).

`limit` es opcional (por defecto 10).

### GET `/api/stats/my-top-songs?limit=10`

**Descripción:**
Devuelve el top de canciones más reproducidas por el usuario logueado.

### GET `/api/stats/my-top-artists?limit=10`

**Descripción:**
Devuelve los artistas más reproducidos por el usuario logueado.

### GET `/api/stats/my-top-albums?limit=10`

**Descripción:**
Devuelve los álbumes más reproducidos por el usuario logueado.

### GET `/api/stats/my-top-genres?limit=10`

**Descripción:**
Devuelve los géneros más escuchados por el usuario logueado.

---

## 📤 EXPORT

### GET `/api/stats/export?limit=5`

**Descripción:**
Genera un archivo Excel (.xlsx) con 5 hojas, que incluyen:

- Top canciones global
- Top canciones del usuario
- Top artistas del usuario
- Top álbumes del usuario
- Top géneros del usuario

**Headers de respuesta:**

- `Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- `Content-Disposition: attachment; filename="musicapp_stats.xlsx"`

Se recomienda descargarlo usando curl (ver `docs/estadisticas.md`).