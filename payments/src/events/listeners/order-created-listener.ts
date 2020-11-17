import { Message } from "node-nats-streaming";
import { Subjects, Listener, OrderCreatedEvent } from "@commons-ticketing/commons";
import { Order } from "../../models";
import { queueGroupName } from "../../constants";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const order = Order.build({
      id: data.id,
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
      version: data.version,
    });

    await order.save();
    msg.ack();
  }
}
