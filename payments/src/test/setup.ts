import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
  var signin: (id?: string) => string;
}

jest.mock('../nats-wrapper');

process.env.STRIPE_KEY = 'sk_test_51I0Bw7E1zEexLJgisT90junrshJdNKv2ZkgN0IRacKh6KKo8tO7hUe6m6n9XBncyOtYN53PIGk7Lj1eWUV55Ei6p00rOUe4eWj'

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = 'testtest';

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

beforeEach(async () => {
  jest.clearAllMocks();

  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

/*
  This function returns fake authentication cookies as string
 */
global.signin = (id?: string) => {
  // JWT payload -> { id, email }
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com'
  }
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // session object { jwt: JWT_KEY }
  const session = { jwt: token }

  // session into JSON
  const sessionJSON = JSON.stringify(session);

  // encoded session to base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // return string with encoded data
  return `express:sess=${base64}`
};
