const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

function getToken() {
  return localStorage.getItem('auth_token');
}

function buildHeaders(requiresAuth) {
  const headers = { 'Content-Type': 'application/json' };
  if (requiresAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
}

async function parseErrorMessage(response) {
  try {
    const body = await response.json();
    return body?.message || `Request failed with status ${response.status}.`;
  } catch {
    return `Request failed with status ${response.status}.`;
  }
}

async function request(path, { method = 'GET', body, requiresAuth = true } = {}) {
  const options = {
    method,
    headers: buildHeaders(requiresAuth),
  };

  if (body !== undefined) {
    options.body = JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, options);
  } catch {
    throw new Error('Unable to connect to the server. Please check your connection.');
  }

  if (!response.ok) {
    const message = await parseErrorMessage(response);
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const api = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body, opts = {}) => request(path, { method: 'POST', body, ...opts }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  delete: (path) => request(path, { method: 'DELETE' }),
};
