import { api } from './api.js';

export async function registerUser({ name, email, password }) {
  return api.post('/api/auth/register', { name, email, password }, { requiresAuth: false });
}

export async function loginUser({ email, password }) {
  return api.post('/api/auth/login', { email, password }, { requiresAuth: false });
}

export async function logoutUser() {
  return api.post('/api/auth/logout', undefined);
}
