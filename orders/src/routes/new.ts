import mongoose from "mongoose";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  HTTP_STATUS_CODE,
  OrderStatus,
  NotFoundError,
  UnprocessableEntity,
} from "@commons-ticketing/commons";
import { Ticket, Order } from "../models";

const router = express.Router();

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .notEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("TicketID must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;
    // Find the ticket the user is trying to order in the database
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError();
    }

    // Make sure that this ticket is already not reserved
    const isReserved = await ticket.isReserved();

    if (isReserved) {
      throw new UnprocessableEntity("Ticket already reserved");
    }

    // Calculate expiration date for this order

    // Build the order and persist in the database

    // Publish an event saying that an order was created

    res.send({});
  }
);

export { router as newOrderRouter };
