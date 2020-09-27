import request from "supertest";
import { app } from "../../app";
import { HTTP_STATUS_CODE } from "../../constants";

it("clears the cookies session after signing out", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "12345678",
    })
    .expect(HTTP_STATUS_CODE.CREATED);

  const response = await request(app)
    .post("/api/users/signout")
    .send({})
    .expect(HTTP_STATUS_CODE.OK);

  expect(response.get("Set-Cookie")).toBeDefined();
});
