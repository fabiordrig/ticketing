import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderCancelledEvent } from "@commons-ticketing/commons";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models";

const setup = async () => {
  // Create a listener
  const listener = new OrderCancelledListener(natsWrapper.client);

  // Create and save a ticket
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    userId: "udashduas",
  });
  const orderId = mongoose.Types.ObjectId().toHexString();

  ticket.set({ orderId });

  await ticket.save();

  // Create a fake data object
  const data: OrderCancelledEvent["data"] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  // Create a fake msg object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  // return all of this stuff
  return { msg, data, ticket, orderId, listener };
};

it("Updated the ticket, publishes an event, and acks the message", async () => {
  const { msg, data, ticket, orderId, listener } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket?.orderId).not.toBeDefined();
  expect(msg.ack).toHaveBeenCalled();

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
