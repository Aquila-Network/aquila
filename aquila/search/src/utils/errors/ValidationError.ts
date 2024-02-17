import { HttpError } from "routing-controllers";

export class ValidationError extends HttpError {
	constructor(message: string, public errors: any ) {
    super(400, message);
		this.name = "ValidationError";
		Object.setPrototypeOf(this, ValidationError.prototype);
  }
}