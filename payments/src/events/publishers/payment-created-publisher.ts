import { Subjects, Publisher, PaymentCreatedEvent } from "@dwticketing/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
