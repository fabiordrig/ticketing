import request from "supertest";
import { app } from "../../app";

it("return a 201 on successful signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "12345678",
    })
    .expect(201);
});

it("return a 400 with invalid email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "testtest.com",
      password: "12345678",
    })
    .expect(400);
});

it("return a 400 with invalid password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "12",
    })
    .expect(400);
});

it("return a 400 with missing email and password", async () => {
  return request(app).post("/api/users/signup").send({}).expect(400);
});
