import express, { Application } from 'express';
import compression from 'compression';
import helmet from 'helmet';
import expressPino from 'express-pino-logger';
import swaggerUi from 'swagger-ui-express';
import logger from '../logger';
import configuration from '../config';

const configureMiddlewares = (app: Application) => {
  if (configuration.swaggerEnabled === 'true') {
    app.use(
      '/api-docs',
      swaggerUi.serve,
      // eslint-disable-next-line global-require
      swaggerUi.setup(require('../../swagger.json')),
    );
  }

  // security middleware
  app.use(helmet());

  // add gzip compression
  app.use(compression());

  // support for body in requests
  app.use(express.json());

  // requests logger
  app.use(
    expressPino({
      logger,
    }),
  );
};

export default configureMiddlewares;
