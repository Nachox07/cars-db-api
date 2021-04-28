import express from 'express';
import logger from './logger';

const init = () => {
  const app = express();
  const port = process.env.PORT || 8080;
  const router = express.Router();

  app
    .route('/cars')
    .get((req, res) => {
      res.send('get all cars metadata');
    })
    .post((req, res) => {
      res.send('create a new car');
    });

  app
    .route('/cars/:carId')
    .get((req, res) => {
      res.send('get a car by a given cariId');
    })
    .patch((req, res) => {
      res.send('update car property by carId');
    })
    .delete((req, res) => {
      res.send('delete car by carId');
    });

  app.use(router);

  app.listen(port, () => {
    logger.info(`cars-db-api listening at http://localhost:${port}`);
  });
};

export default init;
