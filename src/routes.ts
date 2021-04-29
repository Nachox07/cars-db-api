import { Application, Router } from 'express';
import CarController from './controllers/car.controller';

const router = Router();

const configureRoutes = async (app: Application) => {
  app
    .route('/cars')
    .get(async (req, res) => {
      const cars = await CarController.getCars();

      res.status(200).json(cars);
    })
    .post(async (req, res) => {
      const carDoc = await CarController.addCar(req.body);

      if (carDoc) {
        res.location(`http://localhost:8080/cars/${carDoc?._id}`);
        res.status(201).json(carDoc);
      }

      return res
        .status(409)
        .json({ message: 'There was an error processing your request' });
    });

  app
    .route('/cars/:carId')
    .get(async (req, res) => {
      const result = await CarController.getCar(req.params.carId);

      if (result) {
        return res.status(200).json(result);
      }

      return res.status(404).json({ message: 'Car was not found' });
    })
    .patch(async (req, res) => {
      const result = await CarController.updateCar(req.params.carId, req.body);

      if (result) {
        res.sendStatus(204);
      }

      return res.status(404).json({ message: 'Car was not found' });
    })
    .delete(async (req, res) => {
      const result = await CarController.deleteCar(req.params.carId);

      if (result) {
        return res.sendStatus(204);
      }

      return res.status(404).json({ message: 'Car was not found' });
    });

  app.use(router);
};

export default configureRoutes;
