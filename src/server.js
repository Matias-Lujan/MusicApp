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
import swaggerDocument from '../docs/openapi.json' assert { type: 'json' };

const server = express();
const morganFormat = morgan(':method :url :status :res[content-length] - :response-time ms');

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
