import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  HTTP_STATUS_CODE,
  NotFoundError,
  UnauthorizedError,
  UnprocessableEntity,
} from "@commons-ticketing/commons";
import { Ticket } from "../models";
import { TicketUpdatedPublisher } from "../events";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.patch(
  "/api/tickets/:id",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price").isFloat({ gt: 0 }).withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.orderId) {
      throw new UnprocessableEntity("Cannot edit a reserved ticket");
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new UnauthorizedError();
    }

    ticket.set({ title: req.body.title, price: req.body.price });

    await ticket.save();

    const { id, title, price, userId, version } = ticket;

    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id,
      title,
      price,
      userId,
      version,
    });

    res.status(HTTP_STATUS_CODE.OK).send(ticket);
  }
);

export { router as updateTicketRouter };
