import { api } from './api.js';

export async function fetchNotes() {
  const data = await api.get('/api/notes');
  return data.notes;
}

export async function fetchNote(id) {
  const data = await api.get(`/api/notes/${id}`);
  return data.note;
}

export async function createNote({ title, content }) {
  const data = await api.post('/api/notes', { title, content });
  return data.note;
}

export async function updateNote(id, { title, content }) {
  const data = await api.put(`/api/notes/${id}`, { title, content });
  return data.note;
}

export async function deleteNote(id) {
  return api.delete(`/api/notes/${id}`);
}
