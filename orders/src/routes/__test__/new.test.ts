import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { getCookieHelper } from "../../test/utils";
import { HTTP_STATUS_CODE } from "@commons-ticketing/commons";
import { Order, OrderStatus, Ticket } from "../../models";
import { natsWrapper } from "../../nats-wrapper";

it("Returns if the ticket does not exist", async () => {
  const cookie = await getCookieHelper();
  const ticketId = mongoose.Types.ObjectId();

  await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId })
    .expect(HTTP_STATUS_CODE.NOT_FOUND);
});

it("Returns an error if the ticket is already reserved", async () => {
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "bla",
    price: 10,
  });

  await ticket.save();
  const cookie = await getCookieHelper();
  const order = Order.build({
    ticket,
    userId: "21312asd",
    status: OrderStatus.CREATED,
    expiresAt: new Date(),
  });

  await order.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId: ticket.id })
    .expect(HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY);
});

it("Reserves a ticket", async () => {
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "bla",
    price: 10,
  });

  await ticket.save();
  const cookie = await getCookieHelper();
  await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId: ticket.id })
    .expect(HTTP_STATUS_CODE.CREATED);
});

it("Emits and order created event", async () => {
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "bla",
    price: 20,
  });

  const cookie = await getCookieHelper();
  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId: ticket.id })
    .expect(HTTP_STATUS_CODE.CREATED);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
