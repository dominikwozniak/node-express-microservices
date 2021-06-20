import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns a 404 if the ticket is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .get(`/api/tickets/${id}`)
    .send()
    .expect(404);
});

it('returns the ticket if the ticket is found', async () => {
  const title = 'test1234';
  const price = 10;

  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: title,
      price: price
    })
    .expect(201);

  const ticketRes = await request(app)
    .get(`/api/tickets/${res.body.id}`)
    .send()
    .expect(200);

  expect(ticketRes.body.title).toEqual(title);
  expect(ticketRes.body.price).toEqual(price);
});