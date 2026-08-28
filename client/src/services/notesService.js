import { api } from './api.js';

export async function fetchNotes() {
  try {
    const data = await api.get('/api/notes');
    return data.notes;
  } catch (err) {
    const error = new Error(err.message || 'Failed to fetch notes');
    if (err.status) error.status = err.status;
    throw error;
  }
}

export async function fetchNote(id) {
  try {
    const data = await api.get(`/api/notes/${id}`);
    return data.note;
  } catch (err) {
    const error = new Error(err.message || `Failed to fetch note ${id}`);
    if (err.status) error.status = err.status;
    throw error;
  }
}

export async function createNote({ title, content }) {
  try {
    const data = await api.post('/api/notes', { title, content });
    return data.note;
  } catch (err) {
    const error = new Error(err.message || 'Failed to create note');
    if (err.status) error.status = err.status;
    throw error;
  }
}

export async function updateNote(id, { title, content }) {
  try {
    const data = await api.put(`/api/notes/${id}`, { title, content });
    return data.note;
  } catch (err) {
    const error = new Error(err.message || `Failed to update note ${id}`);
    if (err.status) error.status = err.status;
    throw error;
  }
}

export async function deleteNote(id) {
  try {
    return await api.delete(`/api/notes/${id}`);
  } catch (err) {
    const error = new Error(err.message || `Failed to delete note ${id}`);
    if (err.status) error.status = err.status;
    throw error;
  }
}
