import { ErrorRequestHandler } from 'express';
import { ValidationError } from 'express-json-validator-middleware';
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from '../exceptions';
import logger from '../logger';

const publicErrors: Record<
  string,
  { status: number; message: (str: string) => string }
> = {
  [ConflictError.name]: {
    status: 409,
    message: () => 'Error while processing the request',
  },
  [ForbiddenError.name]: {
    status: 403,
    message: () => 'Wrong authorization key',
  },
  [NotFoundError.name]: {
    status: 404,
    message: (str) => str,
  },
  [UnauthorizedError.name]: {
    status: 401,
    message: () => 'Authorization information needs to be provided',
  },
  default: {
    status: 500,
    message: () => 'System error',
  },
};

export const exceptionHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _,
) => {
  // AJV validator error has a custom data structure
  if (err instanceof ValidationError) {
    logger.error({ message: err.validationErrors, stack: err.stack });

    return res.status(400).send(err.validationErrors);
  }

  logger.error({ message: err.message, stack: err.stack });

  logger.info(err.validationErrors);

  const publicError = publicErrors[err.name] || publicErrors.default;

  return res
    .status(publicError.status)
    .send({ error: publicError.message(err.message) });
};

export default exceptionHandler;
