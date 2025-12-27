import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';

import songRouter from './routers/song.router.js';
import userRouter from './routers/user.router.js';
import authRouter from './routers/auth.routers.js';
import playlistRouter from './routers/playlist.router.js';
import notFounderHandler from './middleware/notFoundHandler.js';
import statsRouter from './routers/stats.router.js';
import statsExportRouter from './routers/stats.export.router.js';

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { apiRateLimiter, authLimiter } from './middleware/rateLimit.middleware.js';

const server = express();
const morganFormat = morgan(':method :url :status :res[content-length] - :response-time ms');

//Resolver __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Cargar archivo OpenAPI JSON
const swaggerPath = path.join(__dirname, '..', 'docs', 'openapi.json');
const swaggerRaw = fs.readFileSync(swaggerPath, 'utf8');
const swaggerDocument = JSON.parse(swaggerRaw);

server.use(express.json());

// Helmet base
server.use(
  helmet({
    // Deshabilitar Content Security Policy para evitar problemas con Swagger UI
    contentSecurityPolicy: false,
    // API REST → no necesita iframes
    frameguard: { action: 'deny' },

    // Evita MIME sniffing
    contentTypeOptions: true,

    // Política de referrer estricta
    referrerPolicy: { policy: 'no-referrer' },
  }),
);

server.use(morganFormat);

//Endpoint que devuelve el spec en JSON
server.get('/api/docs-json', (req, res) => {
  res.json(swaggerDocument);
});

//Swagger UI usando CDN
server.get('/api/docs', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>MusicApp API Docs</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css" />
</head>
<body>
  <div id="swagger-ui"></div>

  <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = () => {
      SwaggerUIBundle({
        url: '/api/docs-json',
        dom_id: '#swagger-ui',
        presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
        layout: "BaseLayout",
      });
    };
  </script>
</body>
</html>
  `);
});

server.get('/', (req, res) => {
  res.json({
    message: 'Bienvenido a la API de MusicApp',
    status: 'Ok',
  });
});

server.use('/api/auth/login', authLimiter);
server.use('/api', apiRateLimiter);

server.use('/api/song', songRouter);
server.use('/api/user', userRouter);
server.use('/api/auth', authRouter);
server.use('/api/playlist', playlistRouter);
server.use('/api/stats', statsRouter);
server.use('/api/stats', statsExportRouter);

server.use(notFounderHandler);

export default server;
