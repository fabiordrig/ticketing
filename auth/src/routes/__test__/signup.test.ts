import request from "supertest";
import { app } from "../../app";
import { defaultEmail, defaultPassword, HTTP_STATUS_CODE } from "../../test/constants";

it("return a 201 on successful signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: defaultEmail,
      password: defaultPassword,
    })
    .expect(HTTP_STATUS_CODE.CREATED);
});

it("return a 400 with invalid email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "testtest.com",
      password: defaultPassword,
    })
    .expect(HTTP_STATUS_CODE.BAD_REQUEST);
});

it("return a 400 with invalid password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: defaultEmail,
      password: "12",
    })
    .expect(HTTP_STATUS_CODE.BAD_REQUEST);
});

it("return a 400 with missing email and password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({})
    .expect(HTTP_STATUS_CODE.BAD_REQUEST);
});

it("disallows duplicate emails", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: defaultEmail,
      password: defaultPassword,
    })
    .expect(HTTP_STATUS_CODE.CREATED);

  await request(app)
    .post("/api/users/signup")
    .send({
      email: defaultEmail,
      password: defaultPassword,
    })
    .expect(HTTP_STATUS_CODE.CONFLICT);
});

it("sets a cookie after sucessfull signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: defaultEmail,
      password: defaultPassword,
    })
    .expect(HTTP_STATUS_CODE.CREATED);

  expect(response.get("Set-Cookie")).toBeDefined();
});
