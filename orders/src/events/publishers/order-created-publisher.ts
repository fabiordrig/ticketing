import { Publisher, OrderCreatedEvent, Subjects } from "@commons-ticketing/commons";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
