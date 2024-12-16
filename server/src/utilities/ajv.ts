import addFormats from "ajv-formats";
import Ajv, { ErrorObject } from "ajv/dist/2019";

export const ajv = addFormats(new Ajv({}), [
  "date-time",
  "time",
  "date",
  "email",
  "hostname",
  "ipv4",
  "ipv6",
  "uri",
  "uri-reference",
  "uuid",
  "uri-template",
  "json-pointer",
  "relative-json-pointer",
  "regex",
])
  .addKeyword("kind")
  .addKeyword("modifier")
  .addKeyword("typeOf");

export class BaseValidationError extends Error {
  input: unknown;
  errors: ErrorObject[] | null | undefined;

  constructor(
    name: string,
    input: unknown,
    errors: ErrorObject[] | null | undefined,
  ) {
    const received = JSON.stringify(input);
    const error = ajv.errorsText(errors);
    super(`${name}, received: '${received}', error: '${error}'`);
    this.name = this.constructor.name;
    this.input = input;
    this.errors = errors;
  }
}

export class ValidationError extends BaseValidationError {
  constructor(
    input: unknown,
    errors: ErrorObject[] | null | undefined,
    message = "Validation error",
  ) {
    super(message, input, errors);
  }
}
