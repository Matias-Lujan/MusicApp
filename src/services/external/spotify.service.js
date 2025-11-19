import { config } from '../../config/config.js';

let cachedToken = null;
let tokenExpiresAt = 0;

// 0) Obtener access_token con Client Credentials Flow
async function getSpotifyToken() {
  const now = Date.now();
  if (cachedToken && now < tokenExpiresAt) {
    return cachedToken;
  }

  const basic = Buffer.from(`${config.SPOTIFY_CLIENT_ID}:${config.SPOTIFY_CLIENT_SECRET}`).toString(
    'base64',
  );

  const res = await fetch(config.SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!res.ok) {
    console.error('Error obteniendo token de Spotify:', await res.text());
    throw new Error('No se pudo obtener el token de Spotify');
  }

  const data = await res.json();
  cachedToken = data.access_token;
  // expira en data.expires_in (segundos)
  tokenExpiresAt = now + (data.expires_in - 300) * 1000; // 5 min de margen

  return cachedToken;
}

// 1) Buscar track por título + artista
async function searchTrack(titulo, artista) {
  const token = await getSpotifyToken();

  const query = `track:${titulo} artist:${artista}`;
  const url = `${config.SPOTIFY_API_BASE}/search?type=track&limit=1&q=${encodeURIComponent(query)}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    console.error('Error buscando track en Spotify:', await res.text());
    throw new Error('Error buscando track en Spotify');
  }

  const data = await res.json();
  const track = data.tracks?.items?.[0] ?? null;

  return track;
}

// 2) Obtener géneros del artista principal
async function fetchArtistGenres(artistId) {
  if (!artistId) return [];

  const token = await getSpotifyToken();
  const url = `${config.SPOTIFY_API_BASE}/artists/${artistId}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    console.error('Error buscando artista en Spotify:', await res.text());
    return [];
  }

  const data = await res.json();
  // Spotify devuelve array de strings
  return data.genres ?? [];
}

// 3) Función principal que vas a usar desde el controller
export async function fetchDataSpotify(titulo, artista) {
  try {
    const track = await searchTrack(titulo, artista);
    if (!track) return null;

    // Duración: ms → segundos
    const durationSeg = track.duration_ms ? Math.floor(track.duration_ms / 1000) : null;

    const albumName = track.album?.name ?? null;
    const albumReleaseDate = track.album?.release_date ?? null;

    const mainArtist = track.artists?.[0];
    const artistId = mainArtist?.id;

    const genres = await fetchArtistGenres(artistId);

    const albumImages = track.album?.images ?? [];
    const cover = albumImages[0]?.url ?? null;

    return {
      albumName,
      albumReleaseDate,
      durationSeg,
      genres,
      cover,
      trackId: track.id,
      // por si querés guardar también:
      spotifyUrl: track.external_urls?.spotify ?? null,
      previewUrl: track.preview_url ?? null,
    };
  } catch (err) {
    console.error('Error en Spotify Service:', err.message);
    return null;
  }
}
