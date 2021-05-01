import { ErrorRequestHandler } from 'express';
import { ValidationError } from 'express-json-validator-middleware';
import {
  DatabaseException,
  UnauthorizedException,
  ForbiddenException,
} from '../exceptions';
import logger from '../logger';

const publicErrors: Record<string, { status: number; message: string }> = {
  [DatabaseException.name]: {
    status: 500,
    message: 'Error while processing the request',
  },
  [ForbiddenException.name]: {
    status: 403,
    message: 'Wrong authorization key',
  },
  [UnauthorizedException.name]: {
    status: 401,
    message: 'Authorization information needs to be provided',
  },
  default: {
    status: 500,
    message: 'System error',
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
    logger.error({ message: err.message, stack: err.stack });

    return res.status(400).send(err.validationErrors);
  }

  logger.error({ message: err.message, stack: err.stack });

  logger.info(err.validationErrors);

  const publicError = publicErrors[err.name] || publicErrors.default;

  return res.status(publicError.status).send({ error: publicError.message });
};

export default exceptionHandler;
