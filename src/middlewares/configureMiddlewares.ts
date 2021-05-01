import express, { Application } from 'express';
import helmet from 'helmet';
import expressPino from 'express-pino-logger';
import logger from '../logger';
import authorizationHandler from './authorizationHandler';

const configureMiddlewares = (app: Application) => {
  logger.info('configuring middlewares');

  app.use(helmet());
  app.use(express.json());
  app.use(
    expressPino({
      logger,
    }),
  );
  app.use(authorizationHandler);
};

export default configureMiddlewares;
