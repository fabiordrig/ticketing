import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  UnprocessableEntity,
  NotFoundError,
  UnauthorizedError,
  OrderStatus,
} from "@commons-ticketing/commons";
import { Order } from "../models";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [
    body("token").not().isEmpty().withMessage("Missing token"),
    body("orderId").not().isEmpty().withMessage("Missing orderId"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser?.id) {
      throw new UnauthorizedError();
    }

    if (order.status !== OrderStatus.CANCELLED) {
      throw new UnprocessableEntity("Cannot pay for a cancelled order");
    }

    res.send({ success: true });
  }
);

export { router as createChargeRouter };
