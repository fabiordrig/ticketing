import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models";
import { getCookieHelper } from "../../test/utils";
import { HTTP_STATUS_CODE } from "@commons-ticketing/commons";

const buildTicket = async () => {
  const ticket = Ticket.build({
    title: "bla",
    price: 10,
  });

  await ticket.save();
  return ticket;
};

it("Fetches orders for an particular user", async () => {
  const ticketOne = await buildTicket();
  const ticketTwo = await buildTicket();
  const ticketThree = await buildTicket();

  const userOne = await getCookieHelper();
  const userTwo = await getCookieHelper();

  await request(app)
    .post("/api/orders")
    .set("Cookie", userOne)
    .send({ ticketId: ticketOne.id })
    .expect(HTTP_STATUS_CODE.CREATED);

  const { body: orderOne } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({ ticketId: ticketTwo.id })
    .expect(HTTP_STATUS_CODE.CREATED);

  const { body: orderTwo } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({ ticketId: ticketThree.id })
    .expect(HTTP_STATUS_CODE.CREATED);

  const responseOne = await request(app)
    .get("/api/orders")
    .set("Cookie", userTwo)
    .expect(HTTP_STATUS_CODE.OK);

  const responseTwo = await request(app)
    .get("/api/orders")
    .set("Cookie", userOne)
    .expect(HTTP_STATUS_CODE.OK);

  expect(responseOne.body.length).toEqual(2);
  expect(responseTwo.body.length).toEqual(1);
});
