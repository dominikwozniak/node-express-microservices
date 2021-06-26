import nats, { Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

/*
Before run
>> kubectl get pods
- find nats-depl name
>> kubectl port-forward nats-depl-xxx 4222:4222
>> kubectl port-forward nats-depl-xxx 8222:8222
*/

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222'
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  stan.on('close', () => {
    console.log('NATS connection closed');
    process.exit();
  });

  const options = stan.subscriptionOptions()
      .setManualAckMode(true)
      .setDeliverAllAvailable()
      .setDurableName('accounting-service');

  const subscription = stan.subscribe(
      'ticket:created',
      'queue-group-name',
      options
  );

  subscription.on('message', (msg: Message) => {
    const data = msg.getData();

    if (typeof data === 'string') {
      console.log(`Received event #${msg.getSequence()}, with data: ${data}`)
    }

    msg.ack();
  });
});

process.on('SIGINT', () => stan.close());
process.on("SIGTERM", () => stan.close());