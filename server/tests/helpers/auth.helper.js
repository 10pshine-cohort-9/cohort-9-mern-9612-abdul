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

  await request(app).post('/api/auth/register').send(credentials);

  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email: credentials.email, password: credentials.password });

  return {
    token: loginRes.body.token,
    user: loginRes.body.user,
    credentials,
  };
}
