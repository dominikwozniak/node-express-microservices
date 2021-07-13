import { Publisher, OrderCreatedEvent, Subjects } from "@dwticketing/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
