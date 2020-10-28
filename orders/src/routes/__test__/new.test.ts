import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { getCookieHelper } from "../../test/utils";
import { HTTP_STATUS_CODE } from "@commons-ticketing/commons";
import { Order, OrderStatus, Ticket } from "../../models";

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

it.todo("Emits and order created event");
