import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from "@commons-ticketing/commons";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
