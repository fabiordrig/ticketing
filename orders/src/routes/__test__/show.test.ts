import { HTTP_STATUS_CODE } from "@commons-ticketing/commons";
import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { Ticket } from "../../models";
import { getCookieHelper } from "../../test/utils";

it("Fetches the order", async () => {
  const ticket = Ticket.build({
    title: "bla",
    price: 20,
    id: mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();

  const cookie = await getCookieHelper();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId: ticket.id })
    .expect(HTTP_STATUS_CODE.CREATED);

  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", cookie)
    .send()
    .expect(HTTP_STATUS_CODE.OK);

  expect(fetchedOrder.id).toEqual(order.id);
});

it("Returns an error when the user tries to fetch another user order", async () => {
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "bla",
    price: 20,
  });
  await ticket.save();

  const cookieOne = await getCookieHelper();
  const cookieTwo = await getCookieHelper();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", cookieOne)
    .send({ ticketId: ticket.id })
    .expect(HTTP_STATUS_CODE.CREATED);

  await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", cookieTwo)
    .send()
    .expect(HTTP_STATUS_CODE.UNAUTHORIZED);
});
