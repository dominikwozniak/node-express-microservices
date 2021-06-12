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

it('returns a 201 on successful signin', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: '12345678'
    })
    .expect(200);
});

it('returns a 400 when email is invalid', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test1@test.com',
      password: '12345678'
    })
    .expect(400);
});

it('returns a 400 when password is invalid', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: '1'
    })
    .expect(400);
});

it('responds with a cookie when given valid credentials',async () => {
  const res = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: '12345678'
    })
    .expect(200);

  expect(res.get('Set-Cookie'))
    .toBeDefined();
});