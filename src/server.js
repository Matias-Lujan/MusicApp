import express from 'express';
import morgan from 'morgan';

import songRouter from './routers/song.router.js';
import userRouter from './routers/user.router.js';
import authRouter from './routers/auth.routers.js';
import playlistRouter from './routers/playlist.router.js';
import notFounderHandler from './middleware/notFoundHandler.js';
import statsRouter from './routers/stats.router.js';
import statsExportRouter from './routers/stats.export.router.js';

import swaggerUi from 'swagger-ui-express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const server = express();
const morganFormat = morgan(':method :url :status :res[content-length] - :response-time ms');

//__dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Cargar archivo OpenAPI JSON
const swaggerPath = path.join(__dirname, '..', 'docs', 'openapi.json');
const swaggerRaw = fs.readFileSync(swaggerPath, 'utf8');
const swaggerDocument = JSON.parse(swaggerRaw);

server.use(express.json());
server.use(morganFormat);

//Endpoint de documentación Swagger UI
server.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

server.get('/', (req, res) => {
  res.json({
    message: 'Bienvenido a la API de MusicApp',
    status: 'Ok',
  });
});

server.use('/api/song', songRouter);
server.use('/api/user', userRouter);
server.use('/api/auth', authRouter);
server.use('/api/playlist', playlistRouter);
server.use('/api/stats', statsRouter);
server.use('/api/stats', statsExportRouter);

server.use(notFounderHandler);

export default server;
