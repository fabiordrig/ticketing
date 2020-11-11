import { Message } from "node-nats-streaming";
import { Subjects, Listener, OrderCancelledEvent } from "@commons-ticketing/commons";
import { Ticket } from "../../models";
import { queueGroupName } from "../../constants";
import { TicketUpdatedPublisher } from "../publishers";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    ticket.set({ orderId: undefined });

    await ticket.save();

    const { id, title, price, userId, version, orderId } = ticket;

    await new TicketUpdatedPublisher(this.client).publish({
      id,
      title,
      price,
      userId,
      version,
      orderId,
    });

    msg.ack();
  }
}
