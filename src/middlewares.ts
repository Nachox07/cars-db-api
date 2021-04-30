import express, { Application, ErrorRequestHandler } from 'express';
import expressPino from 'express-pino-logger';
import { DatabaseException } from './exceptions';
import logger from './logger';

const publicErrors: Record<string, { status: number; message: string }> = {
  [DatabaseException.name]: {
    status: 500,
    message: 'Error while processing your request',
  },
  default: {
    status: 500,
    message: 'System error',
  },
};

export const exceptionHandler: ErrorRequestHandler = async (
  err,
  req,
  res,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _,
) => {
  logger.error({ message: err.message, stack: err.stack });

  const publicError = publicErrors[err.name] || publicErrors.default;

  res.status(publicError.status).send(publicError.message);
};

const configureMiddlewares = async (app: Application) => {
  app.use(express.json());
  app.use(
    expressPino({
      logger,
    }),
  );
};

export default configureMiddlewares;
