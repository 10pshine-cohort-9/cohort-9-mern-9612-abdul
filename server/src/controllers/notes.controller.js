import {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
} from '../services/notes.service.js';
import logger from '../config/logger.js';

function handleError(res, error, context) {
  const status = error.status || 500;
  const message =
    status === 500
      ? 'An unexpected error occurred. Please try again later.'
      : error.message;

  if (status === 500) {
    logger.error({ err: error, ...context }, 'Unexpected error in notes operation.');
  } else {
    logger.warn({ status, message, ...context }, 'Notes operation failed.');
  }

  return res.status(status).json({ message });
}

export async function createNoteHandler(req, res) {
  try {
    const userId = req.user.id;
    const { title, content } = req.body ?? {};

    const note = await createNote(userId, title, content);

    logger.info({ userId, noteId: note.id }, 'Note created successfully.');

    return res.status(201).json({
      message: 'Note created successfully.',
      note,
    });
  } catch (error) {
    return handleError(res, error, { userId: req.user?.id, operation: 'createNote' });
  }
}

export async function getAllNotesHandler(req, res) {
  try {
    const userId = req.user.id;

    const notes = await getAllNotes(userId);

    logger.info({ userId, count: notes.length }, 'Notes retrieved successfully.');

    return res.status(200).json({
      message: 'Notes retrieved successfully.',
      notes,
    });
  } catch (error) {
    return handleError(res, error, { userId: req.user?.id, operation: 'getAllNotes' });
  }
}

export async function getSingleNoteHandler(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const note = await getNoteById(userId, id);

    logger.info({ userId, noteId: note.id }, 'Note retrieved successfully.');

    return res.status(200).json({
      message: 'Note retrieved successfully.',
      note,
    });
  } catch (error) {
    return handleError(res, error, { userId: req.user?.id, noteId: req.params?.id, operation: 'getNote' });
  }
}

export async function updateNoteHandler(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { title, content } = req.body ?? {};

    const note = await updateNote(userId, id, title, content);

    logger.info({ userId, noteId: note.id }, 'Note updated successfully.');

    return res.status(200).json({
      message: 'Note updated successfully.',
      note,
    });
  } catch (error) {
    return handleError(res, error, { userId: req.user?.id, noteId: req.params?.id, operation: 'updateNote' });
  }
}

export async function deleteNoteHandler(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    await deleteNote(userId, id);

    logger.info({ userId, noteId: id }, 'Note deleted successfully.');

    return res.status(200).json({ message: 'Note deleted successfully.' });
  } catch (error) {
    return handleError(res, error, { userId: req.user?.id, noteId: req.params?.id, operation: 'deleteNote' });
  }
}

