import nats  from 'node-nats-streaming';

/*
Before run
>> kubectl get pods
- find nats-depl name
>> kubectl port-forward nats-depl-xxx 4222:4222
*/

const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222'
});

stan.on('connect', () => {
  console.log('Publisher connected to NATS');

  const data = JSON.stringify({
    id: '123',
    title: 'concert',
    price: 20
  });

  stan.publish('ticket:created', data, () => {
    console.log('Event published');
  });
});
