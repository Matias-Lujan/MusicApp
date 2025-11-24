import ExcelJS from 'exceljs';
import { statsService } from '../services/stats.service.js';

export const StatsExportController = {
  async exportAllStats(req, res) {
    const limit = parseInt(req.query.limit) || 10;
    const userId = req.user.id;

    try {
      const { topSongsGlobal, topSongsUser, topArtistsUser, topAlbumsUser, topGenresUser } =
        await statsService.getAllStats(userId, limit);

      // crea excel
      const workbook = new ExcelJS.Workbook();

      function addSheet(name, columns, rows) {
        const sheet = workbook.addWorksheet(name);
        sheet.columns = columns;
        rows.forEach((r) => sheet.addRow(r));
      }

      // crea pestañas
      addSheet(
        'TopSongsGlobal',
        [
          { header: 'Título', key: 'titulo' },
          { header: 'Artista', key: 'artista' },
          { header: 'Álbum', key: 'album' },
          { header: 'Reproducciones', key: 'reproducciones' },
        ],
        topSongsGlobal,
      );

      addSheet(
        'MyTopSongs',
        [
          { header: 'Título', key: 'titulo' },
          { header: 'Artista', key: 'artista' },
          { header: 'Álbum', key: 'album' },
          { header: 'Reproducciones', key: 'reproducciones' },
        ],
        topSongsUser,
      );

      addSheet(
        'MyTopArtists',
        [
          { header: 'Artista', key: 'artista' },
          { header: 'Reproducciones', key: 'reproducciones' },
        ],
        topArtistsUser,
      );

      addSheet(
        'MyTopAlbums',
        [
          { header: 'Álbum', key: 'album' },
          { header: 'Reproducciones', key: 'reproducciones' },
        ],
        topAlbumsUser,
      );

      addSheet(
        'MyTopGenres',
        [
          { header: 'Género', key: 'genero' },
          { header: 'Reproducciones', key: 'reproducciones' },
        ],
        topGenresUser,
      );

      const buffer = await workbook.xlsx.writeBuffer();

      //headers necesarios para descargar
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader('Content-Disposition', 'attachment; filename="musicapp_stats.xlsx"');

      // devuelve el xlsx
      return res.send(buffer);
    } catch (error) {
      return res.status(500).json({
        status: 500,
        OK: false,
        message: 'Error al generar el archivo XLSX',
        detail: error.message,
      });
    }
  },
};
