import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";
import { HTTP_STATUS_CODE } from "../constants";
export class RequestValidationError extends CustomError {
  statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
  constructor(public errors: ValidationError[]) {
    super("Invalid request parameters");

    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map((err) => {
      return { message: err.msg, field: err.param };
    });
  }
}
