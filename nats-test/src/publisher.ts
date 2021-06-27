import nats  from 'node-nats-streaming';
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

/*
Before run
>> kubectl get pods
- find nats-depl name
>> kubectl port-forward nats-depl-xxx 4222:4222
*/

console.clear();

const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222'
});

stan.on('connect', () => {
  console.log('Publisher connected to NATS');

  const publisher = new TicketCreatedPublisher(stan);

  publisher.publish({
    id: '123',
    title: 'concert',
    price: 20
  });
});
