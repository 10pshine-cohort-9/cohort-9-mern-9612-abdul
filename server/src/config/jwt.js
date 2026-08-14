import 'dotenv/config';
import jwt from 'jsonwebtoken';

const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

if (!JWT_SECRET || JWT_SECRET.trim() === '') {
  console.error('JWT Configuration Error: Missing or empty environment variable: JWT_SECRET');
  process.exit(1);
}

if (!JWT_EXPIRES_IN || JWT_EXPIRES_IN.trim() === '') {
  console.error('JWT Configuration Error: Missing or empty environment variable: JWT_EXPIRES_IN');
  process.exit(1);
}

try {
  const probe = jwt.sign({ _probe: true }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  const decoded = jwt.decode(probe);
  if (!decoded || typeof decoded.exp !== 'number' || !isFinite(decoded.exp) || decoded.exp <= decoded.iat) {
    throw new Error('Resolved to a non-positive or immediate expiry.');
  }
} catch (err) {
  console.error(`JWT Configuration Error: JWT_EXPIRES_IN value "${JWT_EXPIRES_IN}" is invalid: ${err.message}`);
  process.exit(1);
}

export const jwtSecret = JWT_SECRET;
export const jwtExpiresIn = JWT_EXPIRES_IN;
