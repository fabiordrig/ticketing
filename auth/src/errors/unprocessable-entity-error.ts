import { CustomError } from "./custom-error";

export class UnprocessableEntity extends CustomError {
  statusCode = 422;

  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, UnprocessableEntity.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
