import { HTTP_STATUS_CODE, OrderStatus } from "@commons-ticketing/commons";
import request from "supertest";
import { app } from "../../app";
import { Order, Ticket } from "../../models";
import { getCookieHelper } from "../../test/utils";

it("Marks an order as cancelled", async () => {
  const ticket = Ticket.build({ title: "bla", price: 20 });
  await ticket.save();

  const cookie = await getCookieHelper();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId: ticket.id })
    .expect(HTTP_STATUS_CODE.CREATED);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", cookie)
    .send()
    .expect(HTTP_STATUS_CODE.NO_CONTENT);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder?.status === OrderStatus.CANCELLED);
});
