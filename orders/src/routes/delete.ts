import express, { Request, Response } from "express";
import {
  HTTP_STATUS_CODE,
  NotFoundError,
  requireAuth,
  UnauthorizedError,
} from "@commons-ticketing/commons";
import { Order, OrderStatus } from "../models";

const router = express.Router();

router.delete(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate("ticket");

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser?.id) {
      throw new UnauthorizedError();
    }

    order.status = OrderStatus.CANCELLED;
    await order.save();

    res.status(HTTP_STATUS_CODE.NO_CONTENT).send(order);
  }
);

export { router as deleteOrderRouter };
