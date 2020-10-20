import request from "supertest";
import { app } from "../../app";
import { HTTP_STATUS_CODE } from "@commons-ticketing/commons";
import { getCookieHelper } from "../../test/utils";
import { Ticket } from "../../models";
import { natsWrapper } from "../../nats-wrapper";

it("Has a route handler listening to /api/tickets for post requests", async () => {
  const response = await request(app).post("/api/tickets").send({});

  expect(response.status).not.toEqual(HTTP_STATUS_CODE.NOT_FOUND);
});

it("Can only be accessed if the user is signed in", async () => {
  await request(app)
    .post("/api/tickets")
    .send({})
    .expect(HTTP_STATUS_CODE.UNAUTHORIZED);
});

it("Returns a status other than 401 if the user is signed in", async () => {
  const cookie = await getCookieHelper();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({});

  expect(response.status).not.toEqual(HTTP_STATUS_CODE.UNAUTHORIZED);
});

it("Returns an error if an invalid title is provided", async () => {
  const cookie = await getCookieHelper();

  await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 10,
    })
    .expect(HTTP_STATUS_CODE.BAD_REQUEST);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      price: 10,
    })
    .expect(HTTP_STATUS_CODE.BAD_REQUEST);
});

it("Returns an error if an invalid price is provided", async () => {
  const cookie = await getCookieHelper();
  await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "bla",
      price: -10,
    })
    .expect(HTTP_STATUS_CODE.BAD_REQUEST);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "bla",
    })
    .expect(HTTP_STATUS_CODE.BAD_REQUEST);
});

it("Create a ticket with valid inputs", async () => {
  let tickets = await Ticket.find({});

  expect(tickets.length).toEqual(0);

  const title = "bla";
  const price = 10;

  const cookie = await getCookieHelper();
  await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title,
      price,
    })
    .expect(HTTP_STATUS_CODE.CREATED);

  tickets = await Ticket.find({});

  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(price);
  expect(tickets[0].title).toEqual(title);
});

it("Published an event", async () => {
  const title = "asuidhasiu";
  const price = 20;

  const cookie = await getCookieHelper();
  await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title,
      price,
    })
    .expect(HTTP_STATUS_CODE.CREATED);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
