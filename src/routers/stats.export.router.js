import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { StatsExportController } from '../controllers/stats.export.controllers.js';

const statsExportRouter = express.Router();

const { exportAllStats } = StatsExportController;

statsExportRouter.use(authMiddleware);

// Exportar las 5 estadisticas
statsExportRouter.get('/export', exportAllStats);

export default statsExportRouter;
