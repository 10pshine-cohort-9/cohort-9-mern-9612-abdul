import {
  createNote as dbCreateNote,
  findNotesByUser,
  findNoteByIdAndUser,
  updateNoteByIdAndUser,
  deleteNoteByIdAndUser,
} from '../models/note.model.js';
import { AppError } from '../errors/AppError.js';

const MAX_TITLE_LENGTH = 255;

function validateNoteInput(title, content) {
  if (typeof title !== 'string' || title.trim() === '') {
    return 'Title is required.';
  }
  if (title.trim().length > MAX_TITLE_LENGTH) {
    return `Title must not exceed ${MAX_TITLE_LENGTH} characters.`;
  }
  if (typeof content !== 'string' || content.trim() === '') {
    return 'Content is required.';
  }
  return null;
}

function parseNoteId(rawId) {
  const id = Number(rawId);
  if (!Number.isInteger(id) || id < 1) {
    throw new AppError('Note ID must be a positive integer.', 400);
  }
  return id;
}

export async function createNote(userId, title, content) {
  const validationError = validateNoteInput(title, content);
  if (validationError) {
    throw new AppError(validationError, 400);
  }

  return dbCreateNote(userId, title.trim(), content.trim());
}

export async function getAllNotes(userId) {
  return findNotesByUser(userId);
}

export async function getNoteById(userId, rawId) {
  const id = parseNoteId(rawId);

  const note = await findNoteByIdAndUser(id, userId);
  if (!note) {
    throw new AppError('Note not found.', 404);
  }

  return note;
}

export async function updateNote(userId, rawId, title, content) {
  const id = parseNoteId(rawId);

  const validationError = validateNoteInput(title, content);
  if (validationError) {
    throw new AppError(validationError, 400);
  }

  const note = await updateNoteByIdAndUser(id, userId, title.trim(), content.trim());
  if (!note) {
    throw new AppError('Note not found.', 404);
  }

  return note;
}

export async function deleteNote(userId, rawId) {
  const id = parseNoteId(rawId);

  const deleted = await deleteNoteByIdAndUser(id, userId);
  if (!deleted) {
    throw new AppError('Note not found.', 404);
  }
}
