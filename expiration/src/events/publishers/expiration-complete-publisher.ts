import { Subjects, Publisher, ExpirationCompleteEvent } from "@dwticketing/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete
}
