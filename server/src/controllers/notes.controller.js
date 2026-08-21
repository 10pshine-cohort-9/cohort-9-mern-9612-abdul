import {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
} from '../services/notes.service.js';

function handleError(res, error) {
  const status = error.status || 500;
  const message =
    status === 500
      ? 'An unexpected error occurred. Please try again later.'
      : error.message;
  return res.status(status).json({ message });
}

export async function createNoteHandler(req, res) {
  try {
    const userId = req.user.id;
    const { title, content } = req.body ?? {};

    const note = await createNote(userId, title, content);

    return res.status(201).json({
      message: 'Note created successfully.',
      note,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function getAllNotesHandler(req, res) {
  try {
    const userId = req.user.id;

    const notes = await getAllNotes(userId);

    return res.status(200).json({
      message: 'Notes retrieved successfully.',
      notes,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function getSingleNoteHandler(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const note = await getNoteById(userId, id);

    return res.status(200).json({
      message: 'Note retrieved successfully.',
      note,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function updateNoteHandler(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { title, content } = req.body ?? {};

    const note = await updateNote(userId, id, title, content);

    return res.status(200).json({
      message: 'Note updated successfully.',
      note,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function deleteNoteHandler(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    await deleteNote(userId, id);

    return res.status(200).json({ message: 'Note deleted successfully.' });
  } catch (error) {
    return handleError(res, error);
  }
}
