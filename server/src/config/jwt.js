import 'dotenv/config';
import jwt from 'jsonwebtoken';
import logger from './logger.js';

const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

if (!JWT_SECRET || JWT_SECRET.trim() === '') {
  logger.error('JWT configuration error: missing or empty environment variable JWT_SECRET.');
  process.exit(1);
}

if (Buffer.byteLength(JWT_SECRET, 'utf8') < 32) {
  logger.error('JWT configuration error: JWT_SECRET must be at least 32 bytes for HS256.');
  process.exit(1);
}

if (!JWT_EXPIRES_IN || JWT_EXPIRES_IN.trim() === '') {
  logger.error('JWT configuration error: missing or empty environment variable JWT_EXPIRES_IN.');
  process.exit(1);
}

try {
  const probe = jwt.sign({ _probe: true }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  const decoded = jwt.decode(probe);
  if (!decoded || typeof decoded.exp !== 'number' || !isFinite(decoded.exp) || decoded.exp <= decoded.iat) {
    throw new Error('Resolved to a non-positive or immediate expiry.');
  }
} catch (err) {
  logger.error({ err }, `JWT configuration error: JWT_EXPIRES_IN value "${JWT_EXPIRES_IN}" is invalid.`);
  process.exit(1);
}

export const jwtSecret = JWT_SECRET;
export const jwtExpiresIn = JWT_EXPIRES_IN;
