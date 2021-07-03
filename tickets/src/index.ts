import { app } from './app';
import mongoose from 'mongoose';
import { natsWrapper } from "./nats-wrapper";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KET must be defined');
  }

  try {
    await natsWrapper.connect('ticketing', 'ticketing123', 'http://nats-srv:4222');

    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });

    process.on('SIGINT', () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    await mongoose.connect('mongodb://tickets-mongo-srv:27017/tickets', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    console.log('Connected to database');
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('server is running on port 3000')
  });
}

start();