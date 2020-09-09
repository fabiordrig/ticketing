import { Request, Response, NextFunction } from "express";
export const errorHandler = async (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Deu ruim", err);

  res.status(400).send({
    message: "Deu ruim",
  });
};
