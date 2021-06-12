import request from 'supertest';
import { app } from '../../app';

beforeEach(async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: '12345678'
    })
    .expect(201);
});

it('clears the cookie after signing out', async () => {
  const res = await request(app)
    .post('/api/users/signout')
    .send({})
    .expect(200);

  expect(res.get('Set-Cookie')[0])
    .toEqual('express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly');
});