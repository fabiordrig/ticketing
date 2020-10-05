import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  HTTP_STATUS_CODE,
  NotFoundError,
  UnauthorizedError,
} from "@commons-ticketing/commons";
import { Ticket } from "../models";

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
    const { title, price } = req.body;

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new UnauthorizedError();
    }

    ticket.set({ title, body });

    await ticket.save();

    res.status(HTTP_STATUS_CODE.OK).send(ticket);
  }
);

export { router as updateTicketRouter };
