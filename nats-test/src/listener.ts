import nats, { Message, Stan } from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from "./events/ticket-created-listener";

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

  new TicketCreatedListener(stan).listen();
});

process.on('SIGINT', () => stan.close());
process.on("SIGTERM", () => stan.close());



















