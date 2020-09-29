import express, { Request, Response } from "express";
import { HTTP_STATUS_CODE } from "@commons-ticketing/commons";
import { requireAuth } from "@commons-ticketing/commons";

const router = express.Router();

router.post("/api/tickets", requireAuth, (req: Request, res: Response) => {
  res.sendStatus(HTTP_STATUS_CODE.OK);
});

export { router as createTicketRouter };
