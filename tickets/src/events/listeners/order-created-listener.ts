import { Message } from "node-nats-streaming";
import { Subjects, Listener, OrderCreatedEvent } from "@commons-ticketing/commons";
import { Ticket } from "../../models";
import { queueGroupName } from "../../constants";
import { TicketUpdatedPublisher } from "../publishers";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    ticket.set({ orderId: data.id });

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
