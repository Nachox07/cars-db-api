import { Server } from 'http';
import express from 'express';
import { createDbConnection, closeDbConnection } from './db/connection';
import logger from './logger';
import configureMiddlewares from './middlewares/configureMiddlewares';
import configureRoutes from './routes';
import { exceptionHandler } from './middlewares/exceptionHandler';
import config from './config';

let serverInstance: Server;

const start = async () => {
  const app = express();
  const { port } = config.server;

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

export const init = async () => {
  try {
    logger.info('Starting cars-db-api');
    return await start();
  } catch (err) {
    logger.error({
      message: `Error while starting cars-db-api: ${err.message}, ${err.stack}`,
    });
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
