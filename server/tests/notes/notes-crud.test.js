import { expect } from 'chai';
import request from 'supertest';
import app from '../../src/app.js';
import { cleanDatabase } from '../setup.js';
import { registerAndLogin } from '../helpers/auth.helper.js';

describe('Notes API', () => {
  describe('POST /api/notes — Create Note', () => {
    let token;
    let userId;

    before(async () => {
      await cleanDatabase();
      const auth = await registerAndLogin({
        name: 'Creator',
        email: 'creator@example.com',
      });
      token = auth.token;
      userId = auth.user.id;
    });

    it('should create a note successfully', async () => {
      const res = await request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Test Note', content: 'Test Content' });

      expect(res.status).to.equal(201);
      expect(res.body.message).to.equal('Note created successfully.');
      expect(res.body.note).to.have.property('id').that.is.a('number');
      expect(res.body.note).to.have.property('title', 'Test Note');
      expect(res.body.note).to.have.property('content', 'Test Content');
      expect(res.body.note).to.have.property('created_at');
      expect(res.body.note).to.have.property('updated_at');
    });

    it('should set correct user_id ownership on the created note', async () => {
      const res = await request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Ownership Check', content: 'Content' });

      expect(res.status).to.equal(201);
      expect(res.body.note.user_id).to.equal(userId);
    });

    it('should reject note creation without authentication', async () => {
      const res = await request(app)
        .post('/api/notes')
        .send({ title: 'No Auth', content: 'Content' });

      expect(res.status).to.equal(401);
    });

    it('should reject note creation when title is missing', async () => {
      const res = await request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${token}`)
        .send({ content: 'Content only' });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message').that.is.a('string');
    });

    it('should reject note creation when content is missing', async () => {
      const res = await request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Title only' });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message').that.is.a('string');
    });
  });

  describe('GET /api/notes — Get All Notes', () => {
    let tokenA;
    let tokenB;

    before(async () => {
      await cleanDatabase();

      const authA = await registerAndLogin({
        name: 'User A',
        email: 'usera_getall@example.com',
      });
      tokenA = authA.token;

      const authB = await registerAndLogin({
        name: 'User B',
        email: 'userb_getall@example.com',
      });
      tokenB = authB.token;

      await request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ title: 'A Note 1', content: 'Content A1' });
      await request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ title: 'A Note 2', content: 'Content A2' });

      await request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${tokenB}`)
        .send({ title: 'B Note 1', content: 'Content B1' });
    });

    it('should retrieve all notes for the authenticated user', async () => {
      const res = await request(app)
        .get('/api/notes')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(res.status).to.equal(200);
      expect(res.body.notes).to.be.an('array').with.lengthOf(2);
      res.body.notes.forEach((note) => {
        expect(note).to.have.property('title');
        expect(note).to.have.property('content');
      });
    });

    it('should not return notes belonging to another user', async () => {
      const res = await request(app)
        .get('/api/notes')
        .set('Authorization', `Bearer ${tokenB}`);

      expect(res.status).to.equal(200);
      expect(res.body.notes).to.have.lengthOf(1);
      expect(res.body.notes[0].title).to.equal('B Note 1');
    });

    it('should return an empty array when the user has no notes', async () => {
      await cleanDatabase();

      const auth = await registerAndLogin({
        name: 'Empty',
        email: 'empty@example.com',
      });

      const res = await request(app)
        .get('/api/notes')
        .set('Authorization', `Bearer ${auth.token}`);

      expect(res.status).to.equal(200);
      expect(res.body.notes).to.be.an('array').that.is.empty;
    });

    it('should reject unauthenticated request', async () => {
      const res = await request(app).get('/api/notes');

      expect(res.status).to.equal(401);
    });
  });

  describe('GET /api/notes/:id — Get Single Note', () => {
    let tokenA;
    let tokenB;
    let noteA;

    before(async () => {
      await cleanDatabase();

      const authA = await registerAndLogin({
        name: 'User A',
        email: 'usera_get@example.com',
      });
      tokenA = authA.token;

      const authB = await registerAndLogin({
        name: 'User B',
        email: 'userb_get@example.com',
      });
      tokenB = authB.token;

      const createRes = await request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ title: 'A Private Note', content: 'Secret Content' });
      noteA = createRes.body.note;
    });

    it('should retrieve an existing note owned by the user', async () => {
      const res = await request(app)
        .get(`/api/notes/${noteA.id}`)
        .set('Authorization', `Bearer ${tokenA}`);

      expect(res.status).to.equal(200);
      expect(res.body.note.id).to.equal(noteA.id);
      expect(res.body.note.title).to.equal('A Private Note');
    });

    it('should return 404 for a nonexistent note ID', async () => {
      const res = await request(app)
        .get('/api/notes/999999')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('message').that.is.a('string');
    });

    it('should return 404 when accessing another user\'s note', async () => {
      const res = await request(app)
        .get(`/api/notes/${noteA.id}`)
        .set('Authorization', `Bearer ${tokenB}`);

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('message').that.is.a('string');
    });

    it('should return 400 for an invalid note ID format', async () => {
      const res = await request(app)
        .get('/api/notes/not-a-number')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message').that.is.a('string');
    });

    it('should reject unauthenticated request', async () => {
      const res = await request(app).get(`/api/notes/${noteA.id}`);

      expect(res.status).to.equal(401);
    });
  });

  describe('PUT /api/notes/:id — Update Note', () => {
    let tokenA;
    let tokenB;
    let noteA;

    beforeEach(async () => {
      await cleanDatabase();

      const authA = await registerAndLogin({
        name: 'User A',
        email: 'usera_put@example.com',
      });
      tokenA = authA.token;

      const authB = await registerAndLogin({
        name: 'User B',
        email: 'userb_put@example.com',
      });
      tokenB = authB.token;

      const createRes = await request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ title: 'Original Title', content: 'Original Content' });
      noteA = createRes.body.note;
    });

    it('should update a note successfully', async () => {
      const res = await request(app)
        .put(`/api/notes/${noteA.id}`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ title: 'Updated Title', content: 'Updated Content' });

      expect(res.status).to.equal(200);
      expect(res.body.note.title).to.equal('Updated Title');
      expect(res.body.note.content).to.equal('Updated Content');
    });

    it('should return 404 for a nonexistent note', async () => {
      const res = await request(app)
        .put('/api/notes/999999')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ title: 'New', content: 'New' });

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('message').that.is.a('string');
    });

    it('should return 404 when updating another user\'s note', async () => {
      const res = await request(app)
        .put(`/api/notes/${noteA.id}`)
        .set('Authorization', `Bearer ${tokenB}`)
        .send({ title: 'Hijacked', content: 'Hijacked' });

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('message').that.is.a('string');
    });

    it('should reject update with missing title', async () => {
      const res = await request(app)
        .put(`/api/notes/${noteA.id}`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ content: 'Content only' });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message').that.is.a('string');
    });

    it('should reject update with missing content', async () => {
      const res = await request(app)
        .put(`/api/notes/${noteA.id}`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ title: 'Title only' });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message').that.is.a('string');
    });

    it('should return 400 for an invalid note ID', async () => {
      const res = await request(app)
        .put('/api/notes/abc')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ title: 'T', content: 'C' });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message').that.is.a('string');
    });

    it('should reject unauthenticated update request', async () => {
      const res = await request(app)
        .put(`/api/notes/${noteA.id}`)
        .send({ title: 'T', content: 'C' });

      expect(res.status).to.equal(401);
    });
  });

  describe('DELETE /api/notes/:id — Delete Note', () => {
    let tokenA;
    let tokenB;
    let noteA;

    beforeEach(async () => {
      await cleanDatabase();

      const authA = await registerAndLogin({
        name: 'User A',
        email: 'usera_del@example.com',
      });
      tokenA = authA.token;

      const authB = await registerAndLogin({
        name: 'User B',
        email: 'userb_del@example.com',
      });
      tokenB = authB.token;

      const createRes = await request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ title: 'To Delete', content: 'Will be deleted' });
      noteA = createRes.body.note;
    });

    it('should delete a note successfully', async () => {
      const res = await request(app)
        .delete(`/api/notes/${noteA.id}`)
        .set('Authorization', `Bearer ${tokenA}`);

      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('Note deleted successfully.');

      const getRes = await request(app)
        .get(`/api/notes/${noteA.id}`)
        .set('Authorization', `Bearer ${tokenA}`);

      expect(getRes.status).to.equal(404);
    });

    it('should return 404 for a nonexistent note', async () => {
      const res = await request(app)
        .delete('/api/notes/999999')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('message').that.is.a('string');
    });

    it('should return 404 when deleting another user\'s note', async () => {
      const res = await request(app)
        .delete(`/api/notes/${noteA.id}`)
        .set('Authorization', `Bearer ${tokenB}`);

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('message').that.is.a('string');
    });

    it('should return 400 for an invalid note ID', async () => {
      const res = await request(app)
        .delete('/api/notes/xyz')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message').that.is.a('string');
    });

    it('should reject unauthenticated delete request', async () => {
      const res = await request(app).delete(`/api/notes/${noteA.id}`);

      expect(res.status).to.equal(401);
    });
  });

  describe('Note Ownership Security — bidirectional isolation', () => {
    let tokenA;
    let tokenB;
    let noteA;
    let noteB;

    before(async () => {
      await cleanDatabase();

      const authA = await registerAndLogin({
        name: 'User A',
        email: 'usera_own@example.com',
      });
      tokenA = authA.token;

      const authB = await registerAndLogin({
        name: 'User B',
        email: 'userb_own@example.com',
      });
      tokenB = authB.token;

      const resA = await request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ title: 'User A Note', content: 'Private to A' });
      noteA = resA.body.note;

      const resB = await request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${tokenB}`)
        .send({ title: 'User B Note', content: 'Private to B' });
      noteB = resB.body.note;
    });

    it('should prevent User A from reading User B\'s note', async () => {
      const res = await request(app)
        .get(`/api/notes/${noteB.id}`)
        .set('Authorization', `Bearer ${tokenA}`);

      expect(res.status).to.equal(404);
    });

    it('should prevent User A from updating User B\'s note', async () => {
      const res = await request(app)
        .put(`/api/notes/${noteB.id}`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ title: 'Hijacked', content: 'Hijacked' });

      expect(res.status).to.equal(404);
    });

    it('should prevent User A from deleting User B\'s note', async () => {
      const res = await request(app)
        .delete(`/api/notes/${noteB.id}`)
        .set('Authorization', `Bearer ${tokenA}`);

      expect(res.status).to.equal(404);
    });

    it('should prevent User B from reading User A\'s note', async () => {
      const res = await request(app)
        .get(`/api/notes/${noteA.id}`)
        .set('Authorization', `Bearer ${tokenB}`);

      expect(res.status).to.equal(404);
    });

    it('should prevent User B from updating User A\'s note', async () => {
      const res = await request(app)
        .put(`/api/notes/${noteA.id}`)
        .set('Authorization', `Bearer ${tokenB}`)
        .send({ title: 'Hijacked', content: 'Hijacked' });

      expect(res.status).to.equal(404);
    });

    it('should prevent User B from deleting User A\'s note', async () => {
      const res = await request(app)
        .delete(`/api/notes/${noteA.id}`)
        .set('Authorization', `Bearer ${tokenB}`);

      expect(res.status).to.equal(404);
    });

    it('should confirm User A\'s note is unmodified after User B\'s access attempts', async () => {
      const res = await request(app)
        .get(`/api/notes/${noteA.id}`)
        .set('Authorization', `Bearer ${tokenA}`);

      expect(res.status).to.equal(200);
      expect(res.body.note.title).to.equal('User A Note');
      expect(res.body.note.content).to.equal('Private to A');
    });

    it('should confirm User B\'s note is unmodified after User A\'s access attempts', async () => {
      const res = await request(app)
        .get(`/api/notes/${noteB.id}`)
        .set('Authorization', `Bearer ${tokenB}`);

      expect(res.status).to.equal(200);
      expect(res.body.note.title).to.equal('User B Note');
      expect(res.body.note.content).to.equal('Private to B');
    });
  });

  describe('Protected Routes — all notes endpoints require authentication', () => {
    it('should reject unauthenticated POST /api/notes', async () => {
      const res = await request(app)
        .post('/api/notes')
        .send({ title: 'T', content: 'C' });

      expect(res.status).to.equal(401);
    });

    it('should reject unauthenticated GET /api/notes', async () => {
      const res = await request(app).get('/api/notes');

      expect(res.status).to.equal(401);
    });

    it('should reject unauthenticated GET /api/notes/:id', async () => {
      const res = await request(app).get('/api/notes/1');

      expect(res.status).to.equal(401);
    });

    it('should reject unauthenticated PUT /api/notes/:id', async () => {
      const res = await request(app)
        .put('/api/notes/1')
        .send({ title: 'T', content: 'C' });

      expect(res.status).to.equal(401);
    });

    it('should reject unauthenticated DELETE /api/notes/:id', async () => {
      const res = await request(app).delete('/api/notes/1');

      expect(res.status).to.equal(401);
    });
  });
});
