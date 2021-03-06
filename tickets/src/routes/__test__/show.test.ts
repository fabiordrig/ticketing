import request from "supertest";
import { app } from "../../app";
import { HTTP_STATUS_CODE } from "@commons-ticketing/commons";
import { getCookieHelper } from "../../test/utils";

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

  expect(ticketsResponse.body.title).toEqual(title);
  expect(ticketsResponse.body.price).toEqual(price);
});
