import { expect } from 'chai';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../../src/app.js';
import { cleanDatabase } from '../setup.js';

describe('JWT Authentication Middleware', () => {
  const JWT_SECRET = process.env.JWT_SECRET;

  let validToken;
  let userId;

  before(async () => {
    await cleanDatabase();

    const testUser = {
      name: 'Middleware Test User',
      email: 'middleware@example.com',
      password: 'ValidPass123',
    };

    await request(app).post('/api/auth/register').send(testUser);

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    validToken = loginRes.body.token;
    userId = loginRes.body.user.id;
  });

  it('should reject request with no Authorization header', async () => {
    const res = await request(app).get('/api/notes');

    expect(res.status).to.equal(401);
    expect(res.body.message).to.equal('Authentication required.');
  });

  it('should reject request with malformed Authorization header (no Bearer prefix)', async () => {
    const res = await request(app)
      .get('/api/notes')
      .set('Authorization', 'Basic some-credentials');

    expect(res.status).to.equal(401);
    expect(res.body.message).to.equal('Authentication required.');
  });

  it('should reject request with an invalid JWT', async () => {
    const res = await request(app)
      .get('/api/notes')
      .set('Authorization', 'Bearer this.is.not.a.real.jwt');

    expect(res.status).to.equal(401);
    expect(res.body.message).to.include('Invalid or expired token');
  });

  it('should reject request with an expired JWT', async () => {
    const expiredToken = jwt.sign(
      { id: userId, jti: 'expired-jti' },
      JWT_SECRET,
      { expiresIn: '0s' },
    );

    await new Promise((resolve) => setTimeout(resolve, 1100));

    const res = await request(app)
      .get('/api/notes')
      .set('Authorization', `Bearer ${expiredToken}`);

    expect(res.status).to.equal(401);
    expect(res.body.message).to.include('Invalid or expired token');
  });

  it('should reject request with a JWT missing the jti claim', async () => {
    const noJtiToken = jwt.sign({ id: userId }, JWT_SECRET, {
      expiresIn: '1h',
    });

    const res = await request(app)
      .get('/api/notes')
      .set('Authorization', `Bearer ${noJtiToken}`);

    expect(res.status).to.equal(401);
    expect(res.body.message).to.include('Invalid or expired token');
  });

  it('should reject request with a JWT missing the exp claim', async () => {
    const noExpToken = jwt.sign({ id: userId, jti: 'no-exp-jti' }, JWT_SECRET);

    const res = await request(app)
      .get('/api/notes')
      .set('Authorization', `Bearer ${noExpToken}`);

    expect(res.status).to.equal(401);
    expect(res.body.message).to.include('Invalid or expired token');
  });

  it('should reject request with a JWT missing the id claim', async () => {
    const noIdToken = jwt.sign({ jti: 'no-id-jti' }, JWT_SECRET, {
      expiresIn: '1h',
    });

    const res = await request(app)
      .get('/api/notes')
      .set('Authorization', `Bearer ${noIdToken}`);

    expect(res.status).to.equal(401);
    expect(res.body.message).to.equal('Invalid or expired token.');
  });

  it('should reject request with a revoked token', async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'middleware@example.com', password: 'ValidPass123' });
    const tokenToRevoke = loginRes.body.token;

    await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${tokenToRevoke}`);

    const res = await request(app)
      .get('/api/notes')
      .set('Authorization', `Bearer ${tokenToRevoke}`);

    expect(res.status).to.equal(401);
    expect(res.body.message).to.include('Invalid or expired token');
  });

  it('should allow request with a valid token and return data', async () => {
    const res = await request(app)
      .get('/api/notes')
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('notes').that.is.an('array');
  });
});
