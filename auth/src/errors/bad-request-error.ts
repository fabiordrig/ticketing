import { CustomError } from "./custom-error";
import { HTTP_STATUS_CODE } from "../constants";

export class BadRequestError extends CustomError {
  statusCode = HTTP_STATUS_CODE.BAD_REQUEST;

  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
