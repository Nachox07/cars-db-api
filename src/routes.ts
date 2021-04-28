import { Application, Router } from 'express';
import CarController from './controllers/car.controller';

const router = Router();

const configureRoutes = async (app: Application) => {
  app
    .route('/cars')
    .get(async (req, res) => {
      const cars = CarController.getCars();

      res.status(200).json(cars);
    })
    .post(async (req, res) => {
      const carId = await CarController.addCar(req.body);

      if (carId) {
        res.status(200).json({ carId });
      } else {
        res.status(409).send('There was an error processing your request');
      }
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
};

export default configureRoutes;
