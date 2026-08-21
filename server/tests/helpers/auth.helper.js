import request from 'supertest';
import app from '../../src/app.js';

export async function registerAndLogin(overrides = {}) {
  const credentials = {
    name: overrides.name || 'Test User',
    email:
      overrides.email ||
      `test_${Date.now()}_${Math.random().toString(36).slice(2, 8)}@example.com`,
    password: overrides.password || 'ValidPass123',
  };

  const registerRes = await request(app).post('/api/auth/register').send(credentials);
  
  if (registerRes.status !== 201) {
    throw new Error(`Test-user registration failed: ${registerRes.status}`);
  }

  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email: credentials.email, password: credentials.password });

  if (loginRes.status !== 200 || !loginRes.body.token) {
    throw new Error(`Test-user login failed: ${loginRes.status}`);
  }

  return {
    token: loginRes.body.token,
    user: loginRes.body.user,
    credentials,
  };
}
