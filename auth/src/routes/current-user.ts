import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/api/users/currentUser", (req, res, next) => {
  if (!req.session?.jwt) {
    return res.send({ currentUser: null });
  }

  try {
    const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!);
    res.send({ currentUser: payload });
  } catch (error) {
    res.send({ currentUser: null });
  }
});

export { router as currentUserRouter };
