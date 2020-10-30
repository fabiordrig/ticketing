import { Publisher, Subjects, TicketUpdatedEvent } from "@commons-ticketing/commons";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
