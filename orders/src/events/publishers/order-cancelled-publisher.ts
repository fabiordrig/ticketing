import { Publisher, OrderCancelledEvent, Subjects } from "@commons-ticketing/commons";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
