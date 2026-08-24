import pool from '../config/database.js';
import logger from '../config/logger.js';

export async function revokeToken(jti, expiresAt) {
  try {
    await pool.query(
      'INSERT INTO revoked_tokens (jti, expires_at) VALUES ($1, $2) ON CONFLICT (jti) DO NOTHING',
      [jti, expiresAt]
    );
  } catch (err) {
    logger.error({ err }, 'Failed to revoke token.');
    throw err;
  }
}

export async function isTokenRevoked(jti) {
  try {
    const result = await pool.query(
      'SELECT 1 FROM revoked_tokens WHERE jti = $1',
      [jti]
    );
    return result.rowCount > 0;
  } catch (err) {
    logger.error({ err }, 'Failed to check token revocation status.');
    throw err;
  }
}
