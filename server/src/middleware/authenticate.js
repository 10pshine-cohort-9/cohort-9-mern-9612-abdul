import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config/jwt.js';
import { isTokenRevoked } from '../models/revoked_token.model.js';

export async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, jwtSecret);

    if (typeof payload.jti !== 'string' || payload.jti.trim() === '' ||
        typeof payload.exp !== 'number' || !isFinite(payload.exp)) {
      return res.status(401).json({ message: 'Invalid or expired token.' });
    }

    if (await isTokenRevoked(payload.jti)) {
      return res.status(401).json({ message: 'Invalid or expired token.' });
    }

    req.user = { id: payload.id, jti: payload.jti, tokenExp: payload.exp };
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
}
