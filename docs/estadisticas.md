# 📊 Estadísticas y exportación a Excel

---

Las estadísticas se construyen a partir de:

- la tabla `playback_log`, y
- funciones SQL (RPC) definidas en `sql/init_db.sql`.

La API expone estos datos a través de `stats.service.js` y los endpoints `/api/stats`.

---

## 1️⃣ Top canciones global — `/api/stats/top-songs`

**Función SQL usada:** `top_songs_global(limit_param)`

- Cuenta cuántas veces se reprodujo cada canción en toda la aplicación.
- Agrupa por `song_id`, `titulo`, `artista`, `album`.
- Ordena por cantidad de reproducciones descendentemente.

---

## 2️⃣ Mis canciones más reproducidas — `/api/stats/my-top-songs`

**Función SQL usada:** `top_songs_by_user(user_uuid, limit_param)`

- Recibe el `user_id` (desde el token JWT).
- Filtra `playback_log` por `user_id`.
- Agrupa y ordena igual que el top global, pero solo del usuario.

---

## 3️⃣ Mis artistas más reproducidos — `/api/stats/my-top-artists`

**Función SQL usada:** `top_artists_by_user(user_uuid, limit_param)`

- Agrupa por `artista` en base a las reproducciones del usuario.
- Devuelve lista de artistas con cantidad de reproducciones.

---

## 4️⃣ Mis álbumes más reproducidos — `/api/stats/my-top-albums`

**Función SQL usada:** `top_albums_by_user(user_uuid, limit_param)`

- Agrupa por `album` para un usuario dado.

---

## 5️⃣ Mis géneros más escuchados — `/api/stats/my-top-genres`

**Función SQL usada:** `top_genres_by_user(user_uuid, limit_param)`

- Descompone el arreglo `genero` de `songs` usando `unnest`.
- Agrupa por género.
- Cuenta cuántas reproducciones tuvo cada género para ese usuario.

---

## 📤 Exportación a Excel — `/api/stats/export`

Este endpoint:

1. Llama internamente a las 5 funciones SQL (vía `stats.service.js`).
2. Estructura cada resultado como un "sheet" de Excel.
3. Usa la librería `xlsx` para generar un archivo `musicapp_stats.xlsx`.
4. Lo envía como archivo descargable (con `Content-Type` de Excel).

---

### 🧪 Descarga del Excel con `curl` (PowerShell)

Ejemplo documentado también en `sql/init_db.sql`:

```powershell
curl.exe -H "Authorization: Bearer TU_TOKEN" "http://127.0.0.1:3001/api/stats/export?limit=3" -o "exports/musicapp_stats_curl.xlsx"
```

- `TU_TOKEN`: token JWT obtenido del endpoint `/api/auth/login`.
- `limit`: define cuántos registros máximos se incluirán en cada hoja.
- El archivo se guardará dentro de la carpeta `exports/`.

---

## 💡 Notas

- El endpoint `/api/stats/export` no está pensado para verse en el navegador, sino para descargar el archivo.
- En clientes como VS Code REST Client:
  - Se puede usar el botón "Save Response Body", o
  - Directamente usar `curl` para asegurarse de guardar el binario correctamente.

Directamente usar curl para asegurarse de guardar el binario correctamente.

---

## 📌 Relación con playlists

Las playlists no afectan las estadísticas de escucha.  
Las funciones SQL y los endpoints de `/api/stats` se basan exclusivamente en la tabla `playback_log`, por lo que:

- agregar canciones a playlist,
- quitarlas,
- crear o eliminar playlists,
no modifica ningún cálculo estadístico.

Solo las reproducciones reales registradas mediante `/api/song/play/:id` impactan las métricas.