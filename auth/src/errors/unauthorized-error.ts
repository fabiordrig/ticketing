import { CustomError } from "./custom-error";
import { HTTP_STATUS_CODE } from "../constants";

export class UnauthorizedError extends CustomError {
  statusCode = HTTP_STATUS_CODE.UNAUTHORIZED;

  constructor() {
    super("Unauthorized");

    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }

  serializeErrors() {
    return [{ message: "Unauthorized" }];
  }
}
