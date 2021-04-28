import express from 'express';
import createDbConnection from './db/connection';
import logger from './logger';
import configureMiddlewares from './middlewares';
import configureRoutes from './routes';

const init = async () => {
  const app = express();
  const port = process.env.PORT || 8080;

  // Initialise DB connection
  await createDbConnection();

  configureMiddlewares(app);
  configureRoutes(app);

  app.listen(port, () => {
    logger.info(`cars-db-api listening at http://localhost:${port}`);
  });
};

export default init;
