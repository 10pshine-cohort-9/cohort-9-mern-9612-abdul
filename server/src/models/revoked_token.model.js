import pool from '../config/database.js';

export async function revokeToken(jti, expiresAt) {
  await pool.query(
    'INSERT INTO revoked_tokens (jti, expires_at) VALUES ($1, $2) ON CONFLICT (jti) DO NOTHING',
    [jti, expiresAt]
  );
}

export async function isTokenRevoked(jti) {
  const result = await pool.query(
    'SELECT 1 FROM revoked_tokens WHERE jti = $1',
    [jti]
  );
  return result.rowCount > 0;
}
