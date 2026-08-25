import pool from '../config/database.js';
import logger from '../config/logger.js';

export async function findUserByEmail(email) {
  try {
    const result = await pool.query(
      'SELECT id, name, email FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  } catch (err) {
    logger.error({ err }, 'Failed to look up user by email.');
    throw err;
  }
}

export async function findUserByEmailWithPassword(email) {
  try {
    const result = await pool.query(
      'SELECT id, name, email, password FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  } catch (err) {
    logger.error({ err }, 'Failed to look up user credentials.');
    throw err;
  }
}

export async function createUser(name, email, hashedPassword) {
  try {
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hashedPassword]
    );
    return result.rows[0];
  } catch (err) {
    logger.error({ errCode: err.code }, 'Failed to create user.');
    throw err;
  }
}
