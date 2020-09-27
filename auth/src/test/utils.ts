import request from "supertest";
import { app } from "../app";
import { defaultEmail, defaultPassword, HTTP_STATUS_CODE } from "./constants";

export const getCookieHelper = async () => {
  const email = defaultEmail;
  const password = defaultPassword;

  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email,
      password,
    })
    .expect(HTTP_STATUS_CODE.CREATED);

  const cookie = response.get("Set-Cookie");

  return cookie;
};
