import { expect } from 'chai';
import request from 'supertest';
import app from '../../src/app.js';
import { cleanDatabase } from '../setup.js';

describe('POST /api/auth/register', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  const validUser = {
    name: 'Test User',
    email: 'register@example.com',
    password: 'ValidPass123',
  };

  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(validUser);

    expect(res.status).to.equal(201);
    expect(res.body.message).to.equal('User registered successfully.');
    expect(res.body.user).to.have.property('id').that.is.a('number');
    expect(res.body.user).to.have.property('name', validUser.name);
    expect(res.body.user).to.have.property('email', validUser.email);
  });

  it('should never include password in the response', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(validUser);

    expect(res.status).to.equal(201);
    expect(res.body.user).to.not.have.property('password');
    expect(JSON.stringify(res.body)).to.not.include(validUser.password);
  });

  it('should normalize email to lowercase', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...validUser, email: 'UPPER@EXAMPLE.COM' });

    expect(res.status).to.equal(201);
    expect(res.body.user.email).to.equal('upper@example.com');
  });

  it('should reject registration when name is missing', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'a@b.com', password: 'ValidPass123' });

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('message').that.is.a('string');
  });

  it('should reject registration when email is missing', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test', password: 'ValidPass123' });

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('message').that.is.a('string');
  });

  it('should reject registration when password is missing', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test', email: 'a@b.com' });

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('message').that.is.a('string');
  });

  it('should reject registration with an invalid email format', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test', email: 'not-an-email', password: 'ValidPass123' });

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('message').that.is.a('string');
  });

  it('should reject registration when password is shorter than 8 characters', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test', email: 'a@b.com', password: 'Short1' });

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('message').that.is.a('string');
  });

  it('should reject duplicate email registration with 409', async () => {
    await request(app).post('/api/auth/register').send(validUser);

    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...validUser, name: 'Another User' });

    expect(res.status).to.equal(409);
    expect(res.body).to.have.property('message').that.is.a('string');
  });
});
