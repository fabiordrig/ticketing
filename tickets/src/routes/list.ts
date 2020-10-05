import express, { Request, Response } from "express";
import { Ticket } from "../models";
import { NotFoundError } from "@commons-ticketing/commons";

const router = express.Router();

router.get("/api/tickets", async (req: Request, res: Response) => {
  const ticket = await Ticket.find();

  if (!ticket) return new NotFoundError();

  return res.send(ticket);
});

export { router as indexTicketRouter };
