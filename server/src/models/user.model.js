import pool from '../config/database.js';

export async function findUserByEmail(email) {
  const result = await pool.query(
    'SELECT id, name, email FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0] || null;
}

export async function findUserByEmailWithPassword(email) {
  const result = await pool.query(
    'SELECT id, name, email, password FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0] || null;
}

export async function createUser(name, email, hashedPassword) {
  const result = await pool.query(
    'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
    [name, email, hashedPassword]
  );
  return result.rows[0];
}
