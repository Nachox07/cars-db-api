import { ErrorRequestHandler } from 'express';
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
  // ValidationError express-json-validator-middleware
  JsonSchemaValidationError: {
    status: 400,
    message: 'Malformed request',
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
  logger.error({ message: err.message, stack: err.stack });

  const publicError = publicErrors[err.name] || publicErrors.default;

  res.status(publicError.status).send({ error: publicError.message });
};

export default exceptionHandler;
