import nats, { Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

/*
Before run
>> kubectl get pods
- find nats-depl name
>> kubectl port-forward nats-depl-xxx 4222:4222
*/

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222'
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  const subscription = stan.subscribe('ticket:created');

  subscription.on('message', (msg: Message) => {
    const data = msg.getData();

    if (typeof data === 'string') {
      console.log(`Received event #${msg.getSequence()}, with data: ${data}`)
    }
  });
});