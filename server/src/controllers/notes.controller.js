import {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
} from '../services/notes.service.js';
import logger from '../config/logger.js';

export async function createNoteHandler(req, res, next) {
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
    return next(error);
  }
}

export async function getAllNotesHandler(req, res, next) {
  try {
    const userId = req.user.id;

    const notes = await getAllNotes(userId);

    logger.info({ userId, count: notes.length }, 'Notes retrieved successfully.');

    return res.status(200).json({
      message: 'Notes retrieved successfully.',
      notes,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getSingleNoteHandler(req, res, next) {
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
    return next(error);
  }
}

export async function updateNoteHandler(req, res, next) {
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
    return next(error);
  }
}

export async function deleteNoteHandler(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    await deleteNote(userId, id);

    logger.info({ userId, noteId: id }, 'Note deleted successfully.');

    return res.status(200).json({ message: 'Note deleted successfully.' });
  } catch (error) {
    return next(error);
  }
}
