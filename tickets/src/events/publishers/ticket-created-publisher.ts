import { Publisher, Subjects, TicketCreatedEvent } from "@commons-ticketing/commons";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
