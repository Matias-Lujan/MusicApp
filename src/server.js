//import path from 'path'
import express from 'express';
import morgan from 'morgan';
import songRouter from './routers/song.router.js';
import userRouter from './routers/user.router.js';
import authRouter from './routers/auth.routers.js';
import notFounderHandler from './middleware/notFoundHandler.js';

const server = express();
const morganFormat = morgan(':method :url :status :res[content-length] - :response-time ms');

server.use(express.json());
server.use(morganFormat);

server.get('/', (req, res) => {
  res.json({
    message: 'Bienvenido a la API de MusicApp',
    status: 'Ok',
  });
});

server.use('/api/song', songRouter);
server.use('/api/user', userRouter);
server.use('/api/auth', authRouter);

/* server.use((req, res, next) => {
  res.status(404).send('No esta disponible este endpoint: ' + req.url);
}); */
server.use(notFounderHandler);

export default server;
