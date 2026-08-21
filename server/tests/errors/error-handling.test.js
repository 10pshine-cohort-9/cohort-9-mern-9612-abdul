import { expect } from 'chai';
import request from 'supertest';
import app from '../../src/app.js';
import { AppError } from '../../src/errors/AppError.js';
import { errorHandler } from '../../src/middleware/errorHandler.js';

describe('Error Handling', () => {
  describe('AppError', () => {
    it('should set isOperational to true', () => {
      const err = new AppError('test error', 400);
      expect(err.isOperational).to.be.true;
    });

    it('should set the correct statusCode', () => {
      const err = new AppError('not found', 404);
      expect(err.statusCode).to.equal(404);
    });

    it('should set the correct error message', () => {
      const err = new AppError('Custom message', 422);
      expect(err.message).to.equal('Custom message');
    });

    it('should be an instance of Error', () => {
      const err = new AppError('instance check', 500);
      expect(err).to.be.an.instanceOf(Error);
    });

    it('should have name set to AppError', () => {
      const err = new AppError('name check', 400);
      expect(err.name).to.equal('AppError');
    });
  });

  describe('errorHandler middleware', () => {
    function createMockRes() {
      return {
        _status: null,
        _body: null,
        status(code) {
          this._status = code;
          return this;
        },
        json(body) {
          this._body = body;
          return this;
        },
      };
    }

    const mockReq = { method: 'GET', url: '/test' };
    const noopNext = () => {};

    it('should return the operational error message for an AppError', () => {
      const err = new AppError('Bad input data', 400);
      const res = createMockRes();

      errorHandler(err, mockReq, res, noopNext);

      expect(res._status).to.equal(400);
      expect(res._body.message).to.equal('Bad input data');
    });

    it('should return a generic message for non-operational errors', () => {
      const err = new Error('Internal crash details');
      const res = createMockRes();

      errorHandler(err, mockReq, res, noopNext);

      expect(res._status).to.equal(500);
      expect(res._body.message).to.not.include('Internal crash details');
      expect(res._body.message).to.include('unexpected error');
    });

    it('should not expose stack trace in the response body', () => {
      const err = new Error('secret details');
      const res = createMockRes();

      errorHandler(err, mockReq, res, noopNext);

      expect(res._body).to.not.have.property('stack');
      expect(JSON.stringify(res._body)).to.not.include('at ');
    });

    it('should use the status code from an error with a safe statusCode', () => {
      const err = new Error('forbidden');
      err.statusCode = 403;
      const res = createMockRes();

      errorHandler(err, mockReq, res, noopNext);

      expect(res._status).to.equal(403);
    });

    it('should default to 500 for unsupported or unsafe status codes', () => {
      const err = new Error('weird status');
      err.statusCode = 999;
      const res = createMockRes();

      errorHandler(err, mockReq, res, noopNext);

      expect(res._status).to.equal(500);
    });

    it('should handle an error with .status instead of .statusCode', () => {
      const err = new Error('validation error');
      err.status = 400;
      const res = createMockRes();

      errorHandler(err, mockReq, res, noopNext);

      expect(res._status).to.equal(400);
    });
  });

  describe('API error responses', () => {
    it('should return 404 for an unknown route', async () => {
      const res = await request(app).get('/api/does-not-exist');

      expect(res.status).to.equal(404);
    });

    it('should return a JSON response body for validation errors', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({});

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message').that.is.a('string');
    });
  });
});
