import { expect } from 'chai';
import request from 'supertest';
import app from '../../src/app.js';
import { cleanDatabase } from '../setup.js';

describe('POST /api/auth/login', () => {
  const testUser = {
    name: 'Login Test User',
    email: 'login@example.com',
    password: 'ValidPass123',
  };

  before(async () => {
    await cleanDatabase();
    await request(app).post('/api/auth/register').send(testUser);
  });

  it('should login successfully with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal('Login successful.');
  });

  it('should return a JWT token and user data', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    expect(res.body).to.have.property('token').that.is.a('string');
    expect(res.body.token.split('.')).to.have.lengthOf(3);
    expect(res.body.user).to.have.property('id').that.is.a('number');
    expect(res.body.user).to.have.property('name', testUser.name);
    expect(res.body.user).to.have.property('email', testUser.email);
  });

  it('should never include password in the login response', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    expect(res.body.user).to.not.have.property('password');
    expect(JSON.stringify(res.body)).to.not.include(testUser.password);
  });

  it('should reject login when email is missing', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ password: 'ValidPass123' });

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('message').that.is.a('string');
  });

  it('should reject login when password is missing', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@example.com' });

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('message').that.is.a('string');
  });

  it('should reject login with invalid email format', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'not-valid', password: 'ValidPass123' });

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('message').that.is.a('string');
  });

  it('should reject login with a non-existent email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: 'ValidPass123' });

    expect(res.status).to.equal(401);
    expect(res.body).to.have.property('message').that.is.a('string');
  });

  it('should reject login with an incorrect password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: 'WrongPassword123' });

    expect(res.status).to.equal(401);
    expect(res.body).to.have.property('message').that.is.a('string');
  });
});
