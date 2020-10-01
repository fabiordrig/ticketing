import request from "supertest";
import { app } from "../../app";
import { HTTP_STATUS_CODE } from "@commons-ticketing/commons";
import { getCookieHelper } from "../../test/utils";
import { Ticket } from "../../models";
import { response } from "express";

it("Returns a 404 if the ticket is not found", async () => {
  await request(app)
    .get("/api/tickets/asdasda")
    .send()
    .expect(HTTP_STATUS_CODE.NOT_FOUND);
});

it("Returns the ticket if the ticket is found", async () => {
  const title = "saudhsaua";
  const price = 10;
  const cookie = await getCookieHelper();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title, price })
    .expect(HTTP_STATUS_CODE.CREATED);

  const ticketsResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(HTTP_STATUS_CODE.OK);
  console.log(response.body);

  console.log(ticketsResponse.body);

  expect(ticketsResponse.body.title).toEqual(title);
  expect(ticketsResponse.body.price).toEqual(price);
});
