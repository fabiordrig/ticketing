import { HTTP_STATUS_CODE } from "@commons-ticketing/commons";
import request from "supertest";
import { app } from "../../app";
import { getCookieHelper } from "../../test/utils";

const createTicket = async () => {
  const title = "saudhsaua";
  const price = 10;
  const cookie = await getCookieHelper();

  return request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title, price })
    .expect(HTTP_STATUS_CODE.CREATED);
};

it("Can fetch a list of tickets", async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  const response = await request(app)
    .get("/api/tickets")
    .send()
    .expect(HTTP_STATUS_CODE.OK);

  expect(response.body.length).toEqual(3);
});
