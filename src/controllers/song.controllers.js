import { songListResponseDTO, songResponseDTO } from '../dto/songDTO.js';
import { RepositoryFactory } from '../repository/repositoryFactory.js';
import { songService } from '../services/song.service.js';

const database = RepositoryFactory.getSongRepository();

export const SongController = {
  getAll: async (req, res) => {
    try {
      const songs = await database.getAll();
      res.status(200).json({
        status: 200,
        OK: true,
        payload: songListResponseDTO(songs),
      });
    } catch (error) {
      const status = error.statusCode || 500;
      res.status(status).json({
        status,
        OK: false,
        message: error.message || 'Error interno del servidor',
      });
    }
  },

  getById: async (req, res) => {
    const { id } = req.params;
    console.log(`ID enviado x parametro -> ${id}`);

    try {
      const song = await songService.getSongById(id);

      res.status(200).json({
        status: 200,
        OK: true,
        payload: songResponseDTO(song),
      });
    } catch (error) {
      const status = error.statusCode || 400;
      res.status(status).json({
        status,
        OK: false,
        message: error.message,
      });
    }
  },

  createSong: async (req, res) => {
    const { titulo, artista } = req.body;

    try {
      const song = await songService.createSong({ titulo, artista });

      res.status(200).json({
        status: 200,
        OK: true,
        message: 'Cancion creada',
        payload: songResponseDTO(song),
      });
      return;
    } catch (error) {
      const status = error.statusCode || 400;
      res.status(status).json({
        status,
        OK: false,
        message: error.message,
      });
      return;
    }
  },

  deleteSong: async (req, res) => {
    const { id } = req.params;
    console.log(`ID enviado x parametro -> ${id}`);

    try {
      const data = await await songService.deleteSongById(id);

      res.status(200).json({
        status: 200,
        OK: true,
        message: `Cancion ID -> ${id} eliminado de la base de datos`,
        playload: songResponseDTO(data),
      });
    } catch (error) {
      const status = error.statusCode || 400;
      res.status(status).json({
        status,
        OK: false,
        message: error.message,
      });
      return;
    }
  },

  updateSong: async (req, res) => {
    const { id } = req.params;

    try {
      const { oldDataSong, newDataSong } = await songService.updateSongById(id, req.body);

      return res.status(200).json({
        status: 200,
        OK: true,
        oldDataSong,
        newDataSong,
      });
    } catch (error) {
      const status = error.statusCode || 400;

      return res.status(status).json({
        status,
        OK: false,
        message: error.message,
      });
    }
  },
};
