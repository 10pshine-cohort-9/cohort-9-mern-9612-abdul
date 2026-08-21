import pool from '../config/database.js';

export async function createNote(userId, title, content) {
  const result = await pool.query(
    `INSERT INTO notes (user_id, title, content)
     VALUES ($1, $2, $3)
     RETURNING id, user_id, title, content, created_at, updated_at`,
    [userId, title, content]
  );
  return result.rows[0];
}

export async function findNotesByUser(userId) {
  const result = await pool.query(
    `SELECT id, user_id, title, content, created_at, updated_at
     FROM notes
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId]
  );
  return result.rows;
}

export async function findNoteByIdAndUser(id, userId) {
  const result = await pool.query(
    `SELECT id, user_id, title, content, created_at, updated_at
     FROM notes
     WHERE id = $1 AND user_id = $2`,
    [id, userId]
  );
  return result.rows[0] || null;
}

export async function updateNoteByIdAndUser(id, userId, title, content) {
  const result = await pool.query(
    `UPDATE notes
     SET title = $1, content = $2
     WHERE id = $3 AND user_id = $4
     RETURNING id, user_id, title, content, created_at, updated_at`,
    [title, content, id, userId]
  );
  return result.rows[0] || null;
}

export async function deleteNoteByIdAndUser(id, userId) {
  const result = await pool.query(
    `DELETE FROM notes
     WHERE id = $1 AND user_id = $2
     RETURNING id`,
    [id, userId]
  );
  return result.rows[0] || null;
}
