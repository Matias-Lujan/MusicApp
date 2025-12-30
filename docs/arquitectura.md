# 🧩 Arquitectura del proyecto

---

## 📁 Estructura de carpetas

```text
MusicApp/
├── exports/                    # Archivos generados (XLSX de estadísticas)
├── sql/
│   └── init_db.sql            # Definición SQL de tablas y funciones (Supabase)
├── src/
│   ├── app.js                 # Punto de entrada de la app (importa y levanta server.js)
│   ├── server.js              # Configura middlewares y rutas
│   ├── config/
│   │   └── config.js          # Variables de entorno centralizadas (JWT, Supabase, Spotify)
│   ├── controllers/           # Controladores: reciben request y devuelven response
│   │   ├── auth.controllers.js
│   │   ├── song.controllers.js
│   │   ├── user.controllers.js
│   │   └── playback.controllers.js
│   │   ├── playlist.controllers.js   # CRUD de playlists y administración de canciones en playlist
│   ├── databases/             # Conexión a la base de datos
│   │   ├── DatabaseFactory.js # Aplica el patrón Factory para la DB
│   │   └── supabase.cnx.js    # Crea la instancia de conexión a Supabase
│   ├── dto/                   # Data Transfer Objects (shape de las respuestas)
│   │   ├── userDTO.js
│   │   └── songDTO.js
│   ├── middleware/
│   │   ├── admin.middleware.js    # Verifica rol ADMIN
│   │   ├── auth.middleware.js     # Valida token JWT y expone req.user
│   │   └── notFoundHandler.js     # Manejo global de endpoints no existentes (404)
│   ├── repository/            # Capa de acceso a datos
│   │   ├── repositoryFactory.js
│   │   ├── song.supabase.repository.js
│   │   ├── user.supabase.repository.js
│   │   └── playback.supabase.repository.js
│   │   ├── playlist.supabase.repository.js   # Acceso a datos de playlists y playlist_songs
│   ├── routers/               # Ruteo Express
│   │   ├── auth.router.js
│   │   ├── song.router.js
│   │   └── user.router.js
│   │   ├── playlist.router.js         # Endpoints para gestión de playlists
│   ├── services/              # Lógica de negocio
│   │   ├── external/          # Integraciones externas
│   │   │   └── spotify.service.js
│   │   ├── auth.service.js
│   │   ├── song.service.js
│   │   ├── user.service.js
│   │   ├── playback.service.js
│   │   └── stats.service.js   # Llama a funciones RPC de Supabase para estadísticas
│   │   ├── playlist.service.js       # Lógica de negocio para playlists
│   └── utils/
│       ├── string.utils.js
│       └── validations.utils.js
└── test/                      # Pruebas manuales con REST Client
    ├── song.http
    ├── user.http
    ├── auth.http
    ├── playback.http
    └── stats.http
```

---

## 🎮 Controladores (`/controllers`)

**Responsabilidades:**
- Reciben la HTTP request (Express).
- Llaman al service correspondiente.
- Manejan códigos de estado (200, 400, 401, 403, 404, 409, etc.).
- Transforman el resultado a un formato de respuesta consistente (DTOs donde aplica).

**Ejemplos:**
- `song.controllers.js` → CRUD de canciones + uso de songService.
- `user.controllers.js` → CRUD de usuarios + uso de userService.
- `auth.controllers.js` → login y emisión de JWT.
- `playback.controllers.js` → registrar reproducciones usando playbackService.
- `playlist.controllers.js` → CRUD de playlists + agregar y quitar canciones de una playlist.

---

## 🔧 Servicios (`/services`)

Contienen la **lógica de negocio**. No saben nada de Express ni de HTTP.

**Responsabilidades típicas:**
- Validar payloads.
- Coordinar varias operaciones (llamar a repositorios, integraciones externas, etc.).
- Lanzar errores con `statusCode` cuando corresponde (por ejemplo, entidad no encontrada).

### 📌 `/services/external/spotify.service.js`

Encapsula las llamadas a la API de Spotify.
- Usa **Client Credentials Flow** para obtener un `access_token`.
- Dado título y artista:
  - Busca la canción.
  - Completa: album, portada, generos, duracion, fecha_lanzamiento.

Esto permite que el endpoint de creación de canción sea muy simple en el controller (titulo + artista) mientras que el service arma un objeto completo para guardar en `songs`.

### 📌 `playlist.service.js`

Contiene la lógica para:
- crear y eliminar playlists,
- obtener playlists de un usuario,
- agregar canciones a una playlist,
- quitar canciones,
- listar canciones dentro de una playlist.

Coordina validaciones, acceso a datos y respuestas consistentes.


---

## 🗄️ Repositorios (`/repository`)

La capa que habla directamente con Supabase (DB).

**Ejemplos:**
- `song.supabase.repository.js`
- `user.supabase.repository.js`
- `playback.supabase.repository.js`
- `playlist.supabase.repository.js`

**Responsabilidades:**
- Ejecutar queries (select, insert, update, delete, rpc, etc.).
- Manejar errores de Supabase y relanzarlos como `Error`.
- Aislar al resto de la aplicación de los detalles de Supabase.

---

## 🧱 DatabaseFactory (`/databases/DatabaseFactory.js`)

Implementa el **patrón Factory** para la conexión a la base de datos.

- Centraliza la lógica de obtención de la conexión a Supabase.
- Permite, a futuro, cambiar el tipo de DB (por ejemplo, otra implementación) sin cambiar controllers ni services.
- Asegura que el código use una única forma de obtener la conexión.

---

## 🛡️ Middlewares (`/middleware`)

### `auth.middleware.js`
- Lee el header `Authorization: Bearer <access_token>`.
- Verifica el JWT.
- Si es válido, asigna un objeto `req.user` con los datos relevantes (id, email, nombre, role).
- Si no, responde con **401**.

### `admin.middleware.js`
- Verifica que `req.user.role` sea `ADMIN`.
- Si no lo es, responde con **403**.

### `notFoundHandler.js`
- Middleware final para cualquier ruta no matcheada.
- Devuelve un **404** con un mensaje estándar.

### `rateLimit.middleware.js`
- Implementa **rate limiting** para limitar la cantidad de solicitudes.
- Se aplica sobre endpoints sensibles y/o de forma global.
- Ayuda a prevenir abuso de la API y ataques de fuerza bruta.

---

## 🔀 Routers (`/routers`)

Agrupan endpoints por dominio:

- `auth.router.js` → `/api/auth/login`
- `user.router.js` → `/api/user/...`
- `song.router.js` → `/api/song/songs`, `/api/song/:id`, `/api/song/create`, `/api/song/play/:id`, etc.
- `playlist.router.js` → `/api/playlist/...` (crear playlist, listar, agregar o quitar canciones, eliminar).


Se conectan en `server.js`:

```javascript
server.use('/api/song', songRouter);
server.use('/api/user', userRouter);
server.use('/api/auth', authRouter);
server.use('/api/playlist', playlistRouter);
```

---

## 🧰 Utils (`/utils`)

Funciones reutilizables, por ejemplo:

- **`validations.utils.js`**: 
  - Validar email.
  - Validar que un string no esté vacío.
  - Validar fecha de nacimiento (mayor de edad).

- **`string.utils.js`**: 
  - Helpers generales de strings.

---

## 🧪 Pruebas manuales (`/test`)

Se usan archivos `.http` (VS Code REST Client) para probar la API sin Postman.

**Incluyen llamados para:**
- Login y obtención de token.
- CRUD de usuarios.
- CRUD de canciones.
- Registrar reproducciones.
- Consultar estadísticas.
- Probar el endpoint de exportación (aunque para Excel se recomienda `curl`).

---

## 📘 Documentación de API (Swagger)

La API expone documentación interactiva mediante **Swagger UI**, accesible desde: `/api/docs`

Este módulo:

- Permite explorar todos los endpoints.
- Incluye ejemplos de request y response.
- Ofrece soporte para autenticación con JWT.
- Acelera las pruebas durante el desarrollo.

Se configura en el archivo `server.js` mediante `swagger-ui-express`.