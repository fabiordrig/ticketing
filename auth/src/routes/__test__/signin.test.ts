import request from "supertest";
import { app } from "../../app";
import { defaultEmail, defaultPassword } from "../../test/constants";
import { HTTP_STATUS_CODE } from "../../constants";

it("return a 200 on successful signin", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: defaultEmail,
      password: defaultPassword,
    })
    .expect(HTTP_STATUS_CODE.CREATED);
  await request(app)
    .post("/api/users/signin")
    .send({
      email: defaultEmail,
      password: defaultPassword,
    })
    .expect(HTTP_STATUS_CODE.OK);
});

it("fails when that does not exist is supplied", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({
      email: defaultEmail,
      password: defaultPassword,
    })
    .expect(HTTP_STATUS_CODE.BAD_REQUEST);
});

it("fails when an incorrect password is supplied", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: defaultEmail,
      password: defaultPassword,
    })
    .expect(HTTP_STATUS_CODE.CREATED);

  await request(app)
    .post("/api/users/signin")
    .send({
      email: defaultEmail,
      password: "1234567",
    })
    .expect(HTTP_STATUS_CODE.BAD_REQUEST);
});
