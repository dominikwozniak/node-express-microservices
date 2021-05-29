import { ValidationError } from 'express-validator';

export class RequestValidationError extends Error {
  statusCode = 400;

  constructor(public errors: ValidationError[]) {
    super();

    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map(({msg, param}) => {
      return {
        message: msg,
        field: param
      }
    });
  }
}