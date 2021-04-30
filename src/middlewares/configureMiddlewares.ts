import express, { Application } from 'express';
import expressPino from 'express-pino-logger';
import logger from '../logger';
import authorizationHandler from './authorizationHandler';

const configureMiddlewares = (app: Application) => {
  logger.info('configuring middlewares');

  app.use(express.json());
  app.use(
    expressPino({
      logger,
    }),
  );
  app.use(authorizationHandler);
};

export default configureMiddlewares;
