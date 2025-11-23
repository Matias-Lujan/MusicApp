const notFounderHandler = (req, res, next) => {
  res.status(400).json({
    error: 'Rout not found',
    message: `El endpoint ${req.url} no existe dentro de MusicApp`,
    timestamp: new Date().toISOString(),
  });
};

export default notFounderHandler;
