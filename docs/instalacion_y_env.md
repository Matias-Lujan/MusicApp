# ⚙️ Instalación y configuración de entorno

---

## 1️⃣ Requisitos previos

- **Node.js** (recomendado: 18+)
- **npm**
- Cuenta en **Supabase**
- Credenciales de **Spotify Developer** (Client ID y Client Secret)
- (Opcional) Extensión **REST Client** en VS Code para ejecutar los `.http` de `/test`.

---

## 2️⃣ Instalación del proyecto

1. Clonar el repositorio:

```bash
git clone <url-del-repositorio>
cd MusicApp
```

2. Instalar dependencias:

```bash
npm install
```

---

## 3️⃣ Variables de entorno (`.env`)

El proyecto utiliza `dotenv` y un archivo `config.js` para centralizar la configuración.

Tomar como referencia el archivo `.env.sample` y crear un `.env` en la raíz del proyecto.

**Ejemplo de `.env`:**

```env
# Servidor
PORT=3001

# Tipo de base de datos (para RepositoryFactory)
DATABASE=supabase

# Supabase (URL y clave)
SUPABASE_URL=https://TU-PROYECTO.supabase.co
SUPABASE_KEY=TU_SUPABASE_SERVICE_ROLE_O_ANON_KEY

# JWT
JWT_SECRET_KEY=una_clave_secreta_segura
JWT_ACCES_EXPIRES=1d

# Spotify API
SPOTIFY_CLIENT_ID=tu_client_id
SPOTIFY_CLIENT_SECRET=tu_client_secret
SPOTIFY_TOKEN_URL=https://accounts.spotify.com/api/token
```

⚠️ **Importante:**

- `SUPABASE_KEY` debe ser una clave válida de Supabase (generalmente Service Role o anon según la configuración).
- `JWT_SECRET_KEY` debe ser una cadena segura, no trivial.

---

## 4️⃣ Configuración de Supabase

1. Crear un nuevo proyecto en Supabase.
2. Ir a la sección **SQL Editor**.
3. Copiar y ejecutar el contenido de `sql/init_db.sql`.

Esto creará:

**Tablas:**
- `songs`
- `users`
- `playback_log`
- `playlists`
- `playlist_songs`

**Funciones SQL (RPC) para estadísticas:**
- `top_songs_global`
- `top_songs_by_user`
- `top_artists_by_user`
- `top_albums_by_user`
- `top_genres_by_user`

---

## 5️⃣ Levantar el servidor

Usar el script definido en `package.json`:

```bash
npm run dev
```

Por defecto la API quedará escuchando en:

```
http://127.0.0.1:3001
```

Podés verificar con:

```http
GET http://127.0.0.1:3001/
```

La API debería responder algo como:

```json
{
  "message": "Bienvenido a la API de MusicApp",
  "status": "Ok"
}
```

También podés acceder a la documentación interactiva de la API mediante Swagger: http://127.0.0.1:3001/api/docs