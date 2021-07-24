import { Queue } from "bull";
import { queueName } from "./queue-name";

interface QueuePayload {
  orderId: string;
}

const expirationQueue = new Queue<QueuePayload>(queueName, {
  redis: {
    host: process.env.REDIS_HOST
  }
});

expirationQueue.process(async (job) => {

});

export { expirationQueue };
