import express, { Request, Response } from "express";
import { Ticket } from "../models";
import { NotFoundError } from "@commons-ticketing/commons";

const router = express.Router();

router.get("/api/tickets/:id", async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) return new NotFoundError();

  return res.send(ticket);
});

export { router as showTicketRouter };
