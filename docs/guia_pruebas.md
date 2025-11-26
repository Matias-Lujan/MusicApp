# 🧪 Guía de pruebas (end-to-end)

Esta guía muestra un flujo completo para probar la API:

1. Crear usuario ADMIN
2. Loguearse y obtener token
3. Crear canciones (vinculadas a Spotify)
4. Crear usuario normal
5. Login del usuario normal
6. Registrar reproducciones
7. Gestionar playlists
8. Consultar estadísticas
9. Exportar estadísticas
10. Manejo de errores

Adicionalmente, se pueden probar:

- La gestión completa de playlists (crear, listar, agregar/quitar canciones y eliminar).
- La documentación interactiva de la API en Swagger (`/api/docs`).

---

## 1️⃣ Crear usuario ADMIN

**Endpoint:** `POST /api/user/create`  
**Requiere:** un ADMIN previo.  
👉 Para la primera vez, se puede crear directamente desde Supabase.  
En un entorno ya funcionando:

```json
{
  "nombre": "Admin",
  "apellido": "Test",
  "email": "admin@test.com",
  "fecha_nacimiento": "1990-01-01",
  "password": "admin1234",
  "role": "ADMIN"
}
```

---

## 2️⃣ Login de ADMIN y obtención de JWT

**Endpoint:** `POST /api/auth/login`

```json
{
  "email": "admin@test.com",
  "password": "admin1234"
}
```

La respuesta incluye un campo:

```json
"token": "ey..."
```

Guardar el token como variable en los archivos `.http`:

```http
@jwt_token=ey...
```

---

## 3️⃣ Crear canciones (Spotify activo)

**Endpoint:** `POST /api/song/create`  
**Rol requerido:** ADMIN

Ejemplos de body:

```json
{
  "titulo": "Numb",
  "artista": "Linkin Park"
}
```

```json
{
  "titulo": "Blinding Lights",
  "artista": "The Weeknd"
}
```

El service consultará la API de Spotify y completará:

- Álbum (`album`)
- Portada (`portada`)
- Géneros (`genero[]`)
- Duración (`duracion` en segundos)
- Fecha de lanzamiento (`fecha_lanzamiento`)

---

## 4 Crear usuario normal (USER)

**Endpoint:** `POST /api/user/create`  
**Rol requerido:** ADMIN

Ejemplo de body:

```json
{
  "nombre": "Usertest",
  "apellido": "Tester",
  "email": "usertest@gmail.com",
  "fecha_nacimiento": "2000-01-01",
  "password": "12345678",
  "role": "USER"
}
```

---

## 5️⃣ Login con usuario normal

**Endpoint:** `POST /api/auth/login`

```json
{
  "email": "usertest@gmail.com",
  "password": "12345678"
}
```

Guardar el nuevo token para pruebas de usuario común.

---

## 6️⃣ Registrar reproducciones

**Endpoint:** `POST /api/song/play/:id`  
**Acceso:** cualquier usuario autenticado (USER o ADMIN)

Obtener el `id` de alguna canción desde `GET /api/song/songs`.

Ejecutar:

```http
POST http://127.0.0.1:3001/api/song/play/ID_DE_LA_CANCION
Authorization: Bearer {{jwt_token}}
```

Repetir con distintas canciones y varias veces para generar un ranking interesante.

---

## 7️⃣ Gestión de playlists

**Objetivo:** probar la creación y administración de playlists del usuario autenticado.

---

### 7.1 Crear una playlist  
**Endpoint:** `POST /api/playlist/create`

**Body:**
```json
{
  "nombre": "Mis Favoritos",
  "descripcion": "Lista de prueba"
}
La respuesta devolverá el id de la playlist creada.
7.2 Listar playlists del usuario

Endpoint: GET /api/playlist/playlists

Permite verificar que la playlist creada aparece asociada al usuario del token.

7.3 Agregar una canción a la playlist

Endpoint: POST /api/playlist/:id/songs

Body ejemplo:

{
  "songId": "ID_DE_LA_CANCION"
}

Respuesta esperada:

{
  "status": 200,
  "OK": true,
  "message": "Canción agregada a la playlist"
}

7.4 Listar canciones dentro de la playlist

Endpoint: GET /api/playlist/:id/songs

7.5 Quitar una canción de la playlist

Endpoint: DELETE /api/playlist/:id/songs/:songId

7.6 Eliminar la playlist

Endpoint: DELETE /api/playlist/:id

Permite borrar la playlist y validar que desaparece de GET /api/playlist/my.

---

## 8️⃣ Probar endpoints de estadísticas

Todos requieren token (USER o ADMIN).

### 8.1 Top canciones global

```http
GET /api/stats/top-songs?limit=5
Authorization: Bearer {{jwt_token}}
```

### 8.2 Mis canciones más reproducidas

```http
GET /api/stats/my-top-songs?limit=5
Authorization: Bearer {{jwt_token}}
```

### 8.3 Mis artistas más reproducidos

```http
GET /api/stats/my-top-artists?limit=5
Authorization: Bearer {{jwt_token}}
```

### 8.4 Mis álbumes más reproducidos

```http
GET /api/stats/my-top-albums?limit=5
Authorization: Bearer {{jwt_token}}
```

### 8.5 Mis géneros más escuchados

```http
GET /api/stats/my-top-genres?limit=5
Authorization: Bearer {{jwt_token}}
```

---

## 9 Exportar estadísticas a Excel

**Endpoint:** `GET /api/stats/export?limit=5`

**Opción recomendada: curl (PowerShell)**

```powershell
curl.exe -H "Authorization: Bearer TU_TOKEN" "http://127.0.0.1:3001/api/stats/export?limit=3" -o "exports/musicapp_stats_curl.xlsx"
```

Luego abrir el archivo generado con Excel o similar.

---

## 10 Probar manejo de errores

**Sin token:**
- `GET /api/song/songs` → 401

**Sin rol ADMIN:**
- `POST /api/song/create` con usuario USER → 403

**ID inválido:**
- `POST /api/song/play/ID_INEXISTENTE` → 404

**Email duplicado:**
- `POST /api/user/create` con email ya usado → 409

---

Con este flujo se cubren:

- Autenticación y roles
- Spotify integrado en creación de canciones
- Registro de reproducciones
- Administración de playlist
- Estadísticas basadas en SQL (RPC)
- Exportación a Excel
- Manejo de errores y validaciones