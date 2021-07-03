import { Publisher, Subjects, TicketUpdatedEvent } from "@dwticketing/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
