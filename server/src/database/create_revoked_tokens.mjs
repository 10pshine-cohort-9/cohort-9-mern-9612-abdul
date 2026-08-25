import 'dotenv/config';
import pg from 'pg';
import logger from '../config/logger.js';

const pool = new pg.Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

try {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS revoked_tokens (
      id SERIAL PRIMARY KEY,
      jti VARCHAR(255) UNIQUE NOT NULL,
      expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
      revoked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS revoked_tokens_jti_idx ON revoked_tokens (jti);
  `);

  logger.info('revoked_tokens table ready.');
} catch (err) {
  logger.error({ err }, 'Failed to initialize revoked_tokens table.');
  process.exitCode = 1;
} finally {
  try {
    await pool.end();
  } catch (err) {
    logger.error({ err }, 'Failed to close database pool after migration.');
    process.exitCode = 1;
  }
}
