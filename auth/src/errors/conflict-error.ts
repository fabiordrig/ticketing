import { CustomError } from "./custom-error";
import { HTTP_STATUS_CODE } from "../constants";

export class ConflictError extends CustomError {
  statusCode = HTTP_STATUS_CODE.CONFLICT;

  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, ConflictError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
