import { Publisher } from "./base-publisher";
import { TicketCreatedEvent } from "../@types";
import { Subjects } from "../constants";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
