import request from "supertest";
import { app } from "../../app";
import { HTTP_STATUS_CODE } from "@commons-ticketing/commons";
import { getCookieHelper } from "../../test/utils";

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

  console.log(response.status);
  expect(response.status).not.toEqual(HTTP_STATUS_CODE.UNAUTHORIZED);
});

it("Returns an error if an invalid title is provided", async () => {
  const cookie = await getCookieHelper();

  await request(app).post("/api/tickets").set("Cookie", cookie).send({
    title: "",
    price: 10,
  });
});

it("Returns an error if an invalid title is provided", async () => {});

it("Returns an error if an invalid price if provided", async () => {});

it("Create a ticket with valid inputs", async () => {});
