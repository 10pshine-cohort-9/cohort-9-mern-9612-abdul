import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config/jwt.js';
import { isTokenRevoked } from '../models/revoked_token.model.js';
import logger from '../config/logger.js';

export async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn({ method: req.method, url: req.url }, 'Authentication required: missing or malformed Authorization header.');
    return res.status(401).json({ message: 'Authentication required.' });
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, jwtSecret);

    if (typeof payload.jti !== 'string' || payload.jti.trim() === '' ||
        typeof payload.exp !== 'number' || !isFinite(payload.exp)) {
      logger.warn({ method: req.method, url: req.url }, 'Authentication failed: invalid token payload.');
      return res.status(401).json({ message: 'Invalid or expired token.' });
    }

    if (await isTokenRevoked(payload.jti)) {
      logger.warn({ userId: payload.id, method: req.method, url: req.url }, 'Authentication failed: revoked token.');
      return res.status(401).json({ message: 'Invalid or expired token.' });
    }

    req.user = { id: payload.id, jti: payload.jti, tokenExp: payload.exp };
    next();
  } catch {
    logger.warn({ method: req.method, url: req.url }, 'Authentication failed: token verification error.');
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
}

