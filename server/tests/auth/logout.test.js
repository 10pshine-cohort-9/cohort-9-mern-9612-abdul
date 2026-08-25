import { expect } from 'chai';
import request from 'supertest';
import app from '../../src/app.js';
import { cleanDatabase } from '../setup.js';

describe('POST /api/auth/logout', () => {
  const testUser = {
    name: 'Logout Test User',
    email: 'logout@example.com',
    password: 'ValidPass123',
  };

  let token;

  beforeEach(async () => {
    await cleanDatabase();

    await request(app).post('/api/auth/register').send(testUser);
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    token = loginRes.body.token;
  });

  it('should logout successfully with a valid token', async () => {
    const res = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal('Logged out successfully.');
  });

  it('should reject logout without an authentication token', async () => {
    const res = await request(app).post('/api/auth/logout');

    expect(res.status).to.equal(401);
    expect(res.body.message).to.equal('Authentication required.');
  });

  it('should reject subsequent requests with a revoked token after logout', async () => {
    await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${token}`);

    const res = await request(app)
      .get('/api/notes')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(401);
    expect(res.body.message).to.include('Invalid or expired token');
  });
});
