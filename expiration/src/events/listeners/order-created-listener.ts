import { Message } from "node-nats-streaming";
import { Subjects, Listener, OrderCreatedEvent } from "@commons-ticketing/commons";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    msg.ack();
  }
}
