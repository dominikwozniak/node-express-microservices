import Queue from "bull";
import { queueName } from "./queue-name";
import { ExpirationCompletePublisher } from "../events/publishers/expiration-complete-publisher";
import { natsWrapper } from "../nats-wrapper";

interface QueuePayload {
  orderId: string;
}

// @ts-ignore
const expirationQueue = new Queue<QueuePayload>(queueName, {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  await new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId
  })
});

export { expirationQueue };
