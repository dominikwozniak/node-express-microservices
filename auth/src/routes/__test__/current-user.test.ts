import request from 'supertest';
import { app } from '../../app';

let cookie: string[];

beforeEach(async () => {
  const res = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: '12345678'
    })
    .expect(201);

  cookie = res.get('Set-Cookie');
});

it('responds with details about the current user', async () => {
  const res = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(res.body.currentUser.email)
    .toEqual('test@test.com');
});

it('responds with null if not authenticated', async () => {
  const res = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(200);

  expect(res.body.currentUser.email)
    .toEqual(null);
});