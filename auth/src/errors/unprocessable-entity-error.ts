import { CustomError } from "./custom-error";
import { HTTP_STATUS_CODE } from "../constants";

export class UnprocessableEntity extends CustomError {
  statusCode = HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY;

  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, UnprocessableEntity.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
