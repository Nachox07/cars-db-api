import express, { Application } from 'express';
import helmet from 'helmet';
import expressPino from 'express-pino-logger';
import swaggerUi from 'swagger-ui-express';
import logger from '../logger';
import authorizationHandler from './authorizationHandler';

const configureMiddlewares = (app: Application) => {
  if (process.env.NODE_ENV !== 'production') {
    app.use(
      '/api-docs',
      swaggerUi.serve,
      // eslint-disable-next-line global-require
      swaggerUi.setup(require('../../swagger.json')),
    );
  }

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
