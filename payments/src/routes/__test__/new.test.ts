import request from "supertest";
import { app } from "../../app";
import { getCookieHelper } from "../../test/utils";
import mongoose from "mongoose";
import { Order } from "../../models";
import { HTTP_STATUS_CODE, OrderStatus } from "@commons-ticketing/commons";

it("Return a 404 when purchasing an order that doesn't not exists", async () => {
  const cookie = await getCookieHelper();

  await request(app)
    .post("api/payments")
    .set("Cookie", cookie)
    .send({
      token: mongoose.Types.ObjectId().toHexString(),
      orderId: mongoose.Types.ObjectId().toHexString(),
    })
    .expect(HTTP_STATUS_CODE.NOT_FOUND);
});

it("Return a 401 when purchasing an order that doesn't belong to the user", async () => {
  const cookie = await getCookieHelper();

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: mongoose.Types.ObjectId().toHexString(),
    price: 10,
    version: 0,
    status: OrderStatus.CREATED,
  });

  await order.save();

  console.log(order);

  await request(app)
    .post("api/payments")
    .set("Cookie", cookie)
    .send({
      token: mongoose.Types.ObjectId().toHexString(),
      orderId: order.id,
    })
    .expect(HTTP_STATUS_CODE.UNAUTHORIZED);
});

it("Return a 422 when purchasing a cancelled order", async () => {});
