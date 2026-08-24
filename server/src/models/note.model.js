import pool from '../config/database.js';
import logger from '../config/logger.js';

export async function createNote(userId, title, content) {
  try {
    const result = await pool.query(
      `INSERT INTO notes (user_id, title, content)
       VALUES ($1, $2, $3)
       RETURNING id, user_id, title, content, created_at, updated_at`,
      [userId, title, content]
    );
    return result.rows[0];
  } catch (err) {
    logger.error({ err, userId }, 'Failed to create note.');
    throw err;
  }
}

export async function findNotesByUser(userId) {
  try {
    const result = await pool.query(
      `SELECT id, user_id, title, content, created_at, updated_at
       FROM notes
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );
    return result.rows;
  } catch (err) {
    logger.error({ err, userId }, 'Failed to retrieve notes for user.');
    throw err;
  }
}

export async function findNoteByIdAndUser(id, userId) {
  try {
    const result = await pool.query(
      `SELECT id, user_id, title, content, created_at, updated_at
       FROM notes
       WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );
    return result.rows[0] || null;
  } catch (err) {
    logger.error({ err, userId }, 'Failed to retrieve note.');
    throw err;
  }
}

export async function updateNoteByIdAndUser(id, userId, title, content) {
  try {
    const result = await pool.query(
      `UPDATE notes
       SET title = $1,
           content = $2,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3 AND user_id = $4
       RETURNING id, user_id, title, content, created_at, updated_at`,
      [title, content, id, userId]
    );
    return result.rows[0] || null;
  } catch (err) {
    logger.error({ err, userId }, 'Failed to update note.');
    throw err;
  }
}

export async function deleteNoteByIdAndUser(id, userId) {
  try {
    const result = await pool.query(
      `DELETE FROM notes
       WHERE id = $1 AND user_id = $2
       RETURNING id`,
      [id, userId]
    );
    return result.rows[0] || null;
  } catch (err) {
    logger.error({ err, userId }, 'Failed to delete note.');
    throw err;
  }
}
