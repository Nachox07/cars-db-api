import { Server } from 'http';
import express from 'express';
import { createDbConnection, closeDbConnection } from './db/connection';
import logger from './logger';
import configureMiddlewares, { exceptionHandler } from './middlewares';
import configureRoutes from './routes';

let serverInstance: Server;

const start = async () => {
  const app = express();
  const port = process.env.PORT || 8080;

  // Initialise DB connection
  await createDbConnection();

  configureMiddlewares(app);
  configureRoutes(app);

  app.use(exceptionHandler);

  serverInstance = app.listen(port, () => {
    logger.info(`cars-db-api listening at http://localhost:${port}`);
  });

  return serverInstance;
};

export const init = () => {
  try {
    logger.info('Starting cars-db-api');
    return start();
  } catch (error) {
    logger.error(
      'Error while starting cars-db-api:',
      error.message,
      error.stack,
    );
    return null;
  }
};

export const close = async () => {
  try {
    await closeDbConnection();
    serverInstance.close();
    logger.info({ message: 'Server closed' });
  } catch (err) {
    logger.error({ message: 'No serverInstance running or DB connection' });
  }
};

process.on('SIGTERM', () => {
  logger.info({ message: 'SIGTERM signal received' });

  close();
});
