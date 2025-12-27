import rateLimit from 'express-rate-limit';

/**
 * Key strategy:
 * - Si hay usuario autenticado (req.user.id), limitás por usuario (mejor que IP).
 * - Si no, limitás por IP.
 */
const keyGenerator = (req) => req.user?.id ?? req.ip;

/**
 * Respuesta estándar ante 429 (Too Many Requests)
 */
const handler = (req, res /*, next, options */) => {
  return res.status(429).json({
    status: 429,
    OK: false,
    message: 'Demasiadas solicitudes. Intente nuevamente dentro de 10 minutos.',
  });
};

// Configurar el rate limiter
export const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutos
  max: 5, // Límite de 5 peticiones por ventana
  standardHeaders: true, // Retorna info en headers `RateLimit-*`
  legacyHeaders: false, // Deshabilita headers `X-RateLimit-*`
  skipSuccessfulRequests: true, // No contar peticiones exitosas (status < 400)
  keyGenerator,
  handler,
});

/**
 * PI general (más laxo)
 * Objetivo: limitar abuso general y endpoints sensibles como /api/song/play/:id
 *
 * Ejemplo: 120 requests por minuto por IP/user
 */
export const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator,
  handler,
});
