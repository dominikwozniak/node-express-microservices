import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { natsWrapper } from "../../nats-wrapper";

it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const title = 'test1234';
  const price = 10;

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title,
      price
    })
    .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const title = 'test1234';
  const price = 10;

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title,
      price
    })
    .expect(401);
});

it('returns a 401 if the user does not own the ticket', async () => {
  const title = 'test1234';
  const price = 10;

  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title,
      price
    });

  // try to update data as other user (new cookies)
  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: title + 'test',
      price: price + 10
    })
    .expect(401);
});

it('returns a 400 if the user provides an invalid inputs', async () => {
  const cookie = global.signin();
  const title = 'test1234';
  const price = 10;

  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title,
      price
    });

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: price + 10
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({
      title,
      price: (-1) * price
    })
    .expect(400);
});

it('updates the ticket provided an valid inputs', async () => {
  const cookie = global.signin();
  const title = 'test';
  const price = 10;

  const newTitle = 'test1234';
  const newPrice = 20;

  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title,
      price
    });

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: newTitle,
      price: newPrice
    })
    .expect(200);

  const ticketRes = await request(app)
    .get(`/api/tickets/${res.body.id}`)
    .send()

  expect(ticketRes.body.title).toEqual(newTitle);
  expect(ticketRes.body.price).toEqual(newPrice);
});

it('published an event', async () => {
  const cookie = global.signin();
  const title = 'test';
  const price = 10;

  const newTitle = 'test1234';
  const newPrice = 20;

  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title,
      price
    });

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: newTitle,
      price: newPrice
    })
    .expect(200);

  const ticketRes = await request(app)
    .get(`/api/tickets/${res.body.id}`)
    .send()

  expect(ticketRes.body.title).toEqual(newTitle);
  expect(ticketRes.body.price).toEqual(newPrice);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
