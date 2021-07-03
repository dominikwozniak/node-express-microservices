import { Publisher, Subjects, TicketCreatedEvent } from "@dwticketing/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
