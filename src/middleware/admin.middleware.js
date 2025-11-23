export function isAdmin(req, res, next) {
  if (!req.user || !req.user.role) {
    return res.status(401).json({
      status: 401,
      OK: false,
      message: 'Usuario no autenticado',
    });
  }

  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({
      status: 403,
      OK: false,
      message: 'No tenés permisos para acceder a este recurso',
    });
  }

  next();
}
