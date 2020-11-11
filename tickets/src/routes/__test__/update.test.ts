import request from "supertest";
import { app } from "../../app";
import mongoose, { set } from "mongoose";
import { getCookieHelper } from "../../test/utils";
import { HTTP_STATUS_CODE } from "@commons-ticketing/commons";
import { natsWrapper } from "../../nats-wrapper";
import { Ticket } from "../../models";

const title = "saudhsaua";
const price = 10;
const id = new mongoose.Types.ObjectId().toHexString();

it("Returns a 404 if the provided id does not exist", async () => {
  const cookie = await getCookieHelper();
  await request(app)
    .patch(`/api/tickets/${id}`)
    .set("Cookie", cookie)
    .send({ title, price })
    .expect(HTTP_STATUS_CODE.NOT_FOUND);
});

it("Returns a 401 if the user is not authenticated", async () => {
  await request(app)
    .patch(`/api/tickets/${id}`)
    .send({ title, price })
    .expect(HTTP_STATUS_CODE.UNAUTHORIZED);
});

it("Returns a 401 if the user does not own the ticket", async () => {
  const cookie = await getCookieHelper();
  const cookie2 = await getCookieHelper();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title, price });

  await request(app)
    .patch(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie2)
    .send({ title, price: 209 })
    .expect(HTTP_STATUS_CODE.UNAUTHORIZED);
});

it("Returns a 400 if the user provides an invalid title or price", async () => {
  const cookie = await getCookieHelper();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title, price });

  await request(app)
    .patch(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "", price: 209 })
    .expect(HTTP_STATUS_CODE.BAD_REQUEST);

  await request(app)
    .patch(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title, price: -9 })
    .expect(HTTP_STATUS_CODE.BAD_REQUEST);
});

it("Update the ticket successfully", async () => {
  const cookie = await getCookieHelper();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title, price });

  await request(app)
    .patch(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title, price })
    .expect(HTTP_STATUS_CODE.OK);

  const ticketResponse = await request(app)
    .patch(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "bla", price })
    .expect(HTTP_STATUS_CODE.OK);

  expect(ticketResponse.body.title).toEqual("bla");
});

it("Published an event", async () => {
  const cookie = await getCookieHelper();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title, price });

  await request(app)
    .patch(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title, price })
    .expect(HTTP_STATUS_CODE.OK);

  const ticketResponse = await request(app)
    .patch(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "bla", price })
    .expect(HTTP_STATUS_CODE.OK);

  expect(ticketResponse.body.title).toEqual("bla");

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it("Rejects updates if the ticket is reserved", async () => {
  const cookie = await getCookieHelper();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title, price });

  const ticket = await Ticket.findById(response.body.id);

  ticket?.set({ orderId: mongoose.Types.ObjectId().toHexString() });

  await ticket?.save();

  await request(app)
    .patch(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title, price })
    .expect(HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY);
});
