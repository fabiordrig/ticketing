import request from "supertest";
import { app } from "../../app";
import { getCookieHelper } from "../../test/utils";
import { defaultEmail } from "../../test/constants";
import { HTTP_STATUS_CODE } from "../../constants";

it("responds with details about the current user", async () => {
  const cookie = await getCookieHelper();

  const response = await request(app)
    .get("/api/users/currentUser")
    .set("Cookie", cookie)
    .send()
    .expect(HTTP_STATUS_CODE.OK);

  expect(response.body.currentUser.email).toEqual(defaultEmail);
});

it("responds with null if not authenticated", async () => {
  const response = await request(app)
    .get("/api/users/currentUser")
    .send()
    .expect(HTTP_STATUS_CODE.OK);

  expect(response.body.currentUser).toEqual(null);
});
