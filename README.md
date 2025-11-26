# 🎵 MusicApp — API REST con Supabase, JWT y Spotify

MusicApp es una API REST creada para gestionar **usuarios** y **canciones**, registrar las **reproducciones** de cada usuario y obtener **estadísticas** de escucha.  
Además, se integra con la **API de Spotify** para completar automáticamente información de las canciones, y permite **exportar estadísticas a Excel (XLSX)**.

Este proyecto forma parte de un **Trabajo Práctico para la materia Taller de Programación 2 con Node.js y Express**.

---

## ✨ Funcionalidades principales

1. **Gestión de usuarios**
   - Alta, baja y modificación de usuarios.
   - Validaciones de email, fecha de nacimiento y contraseña.
   - Soporte de roles: `USER` y `ADMIN`.
   - Password hasheado con `bcrypt`.

2. **Autenticación y autorización**
   - Login con email y contraseña.
   - Emisión de token **JWT**.
   - Middleware de autenticación (`authMiddleware`).
   - Middleware de autorización para rol `ADMIN` (`isAdmin`).

3. **Gestión de canciones**
   - Alta de canciones indicando solo `título` y `artista`.
   - Integración con **Spotify API** para completar:
     - álbum
     - portada
     - géneros
     - duración
     - fecha de lanzamiento
   - CRUD completo: crear, listar, buscar por id, actualizar, eliminar.

4. **Log de reproducciones**
   - Endpoint para "reproducir" una canción.
   - Se registra qué usuario escuchó qué canción, y cuándo.
   - Los datos se almacenan en la tabla `playback_log`.

5. **Estadísticas de escucha**
   - Top de canciones global (todas las reproducciones).
   - Top de canciones por usuario.
   - Top de artistas por usuario.
   - Top de álbumes por usuario.
   - Top de géneros por usuario.
   - Implementadas con **funciones SQL (RPC)** en Supabase.

6. **Exportación a Excel (XLSX)**
   - Endpoint que genera un Excel con 5 hojas:
     - Top global de canciones.
     - Top canciones por usuario.
     - Top artistas por usuario.
     - Top álbumes por usuario.
     - Top géneros por usuario.
   - Se puede descargar vía `curl` o guardando el response body.

7. **Gestión de playlist**
   - Crear playlists personalizadas por usuario (nombre + descripción).
   - Listar todas las playlists del usuario autenticado..
   - Eliminar playlists propias.
   - Agregar canciones a una playlist.
   - Quitar canciones de una playlist.
   - Listar todas las canciones dentro de una playlist.
   - Basado en las tablas playlists y playlist_songs en Supabase.

8. **Documentación de API con Swagger (OpenAPI 3)**
   - Integración con Swagger UI para documentación interactiva.
   - Disponible en el endpoint /api/docs.
   - Permite visualizar todos los endpoints, parámetros, respuestas y códigos HTTP.
   - Soporta autenticación mediante JWT para probar endpoints protegidos.
   - La documentación se actualiza automáticamente al modificar los archivos YAML/JS de especificación.

---

## 🛠️ Tecnologías utilizadas

- **Node.js** + **Express**
- **Supabase** (PostgreSQL gestionado)
- **jsonwebtoken** (JWT)
- **bcryptjs** (hash de contraseñas)
- **morgan** (logging HTTP)
- **dotenv** (variables de entorno)
- **xlsx** (generación de archivos Excel)
- **Biome** (formato / linting)
- **Spotify Web API** (Client Credentials Flow)
- **Swagger UI** (Documentacion Endpoints)

---

## 📦 Instalación rápida

> Detalle completo en: [`docs/instalacion_y_env.md`](./docs/instalacion_y_env.md)

1. Clonar el repositorio:

```bash
git clone <url-del-repo>
cd MusicApp
```

2. Instalar dependencias:

```bash
npm install
```

3. Configurar variables de entorno en `.env` (ver archivo `.env.sample` y la doc detallada).

4. Levantar el servidor:

```bash
npm run dev
```

El servidor se levanta por defecto en:

```
http://127.0.0.1:3001
```

---

## 🧩 Arquitectura del proyecto

Detalle completo en: [`docs/arquitectura.md`](./docs/arquitectura.md)

Estructura general:

```
MusicApp/
├── docs/                        # Documentacion
├── exports/                     # Archivos generados (XLSX de estadísticas)
├── sql/
│   └── init_db.sql              # Definición SQL de tablas y funciones (Supabase)
├── src/
│   ├── app.js                   # Punto de entrada
│   ├── server.js                # Configura middlewares y rutas
│   ├── config/
│   │   └── config.js            # Variables de entorno (JWT, Supabase, Spotify)
│   ├── controllers/
│   ├── databases/
│   ├── dto/
│   ├── middleware/
│   ├── repository/
│   ├── routers/
│   ├── services/
│   │   └── external/            # Integración con Spotify API
│   └── utils/
└── test/                        # Pruebas manuales REST (.http)
```

- Patrón **Repository** para acceso a datos.
- **DatabaseFactory** implementa un Factory para manejar conexiones a la base.
- Integraciones externas aisladas en `/services/external/` (ej: `spotify.service.js`).

---

## 🗃️ Modelo de datos

Detalle completo en: [`docs/modelo_datos.md`](./docs/modelo_datos.md)

**Tablas principales en Supabase:**

- `users` → Usuarios del sistema
- `songs` → Canciones
- `playback_log` → Registro de reproducciones
- `playlists ` → Playlist de usuarios
- `playlist_songs ` → Tabla pivot de registro de canciones por playlist

**Funciones SQL (RPC) para estadísticas:**

- `top_songs_global(limit_param)`
- `top_songs_by_user(user_uuid, limit_param)`
- `top_artists_by_user(user_uuid, limit_param)`
- `top_albums_by_user(user_uuid, limit_param)`
- `top_genres_by_user(user_uuid, limit_param)`

---

## 🌐 Endpoints disponibles

Detalle completo en: [`docs/endpoints.md`](./docs/endpoints.md)

Grupos principales:

- `/api/auth` → Login
- `/api/user` → Gestión de usuarios
- `/api/song` → Gestión de canciones + reproducción (`/play/:id`)
- `/api/stats` → Estadísticas y exportación a XLSX
- `/api/playlist` → Gestión de playlist de usuarios y canciones
---

## 📊 Estadísticas y exportación a Excel

Detalle completo en: [`docs/estadisticas.md`](./docs/estadisticas.md)

- Estadísticas basadas en la tabla `playback_log` y funciones SQL.
- Endpoint `/api/stats/export` genera un archivo `musicapp_stats.xlsx` con 5 hojas, una por cada tipo de estadística.
- Ejemplo de descarga con `curl` (PowerShell) documentado en `init_db.sql` y en `docs/estadisticas.md`.

---

## 🧪 Guía de pruebas

Detalle completo en: [`docs/guia_pruebas.md`](./docs/guia_pruebas.md)

Incluye:

- Crear usuarios (ADMIN y USER).
- Login y obtención de JWT.
- Crear canciones integradas con Spotify.
- Registrar reproducciones.
- Consultar estadísticas.
- Exportar Excel con `curl`.
- Probar casos de error (404, etc).
- Probar el flujo completo de playlists (crear, listar, agregar/quitar canciones y eliminar).
- Explorar y probar los endpoints desde la documentación Swagger en `/api/docs`.

---

## 👥 Autores

Trabajo práctico desarrollado por los estudiantes de Programación de Nuevas Tecnologías: Matias Lujan, Ezequiel Carranza y Tomas Derrosi

- Backend con Node.js, Express y Supabase.
- Integración con Spotify Web API para enriquecimiento de datos musicales.