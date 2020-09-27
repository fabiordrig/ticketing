import { CustomError } from "./custom-error";
import { HTTP_STATUS_CODE } from "../constants";

export class DatabaseConnectionError extends CustomError {
  reason = "Error connecting to database";
  statusCode = HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR;
  constructor() {
    super("Error connecting to db");

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}
