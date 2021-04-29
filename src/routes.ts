import { Application, Router } from 'express';
import CarController from './controllers/car.controller';

const router = Router();

const configureRoutes = async (app: Application) => {
  app
    .route('/cars')
    .get(async (req, res, next) => {
      let cars;

      try {
        cars = await CarController.getCars();
      } catch (err) {
        return next(err);
      }

      return res.status(200).json(cars);
    })
    .post(async (req, res, next) => {
      let carDoc;

      try {
        carDoc = await CarController.addCar(req.body);
      } catch (err) {
        return next(err);
      }

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
    .get(async (req, res, next) => {
      let result;

      try {
        result = await CarController.getCar(req.params.carId);
      } catch (err) {
        return next(err);
      }

      if (result) {
        return res.status(200).json(result);
      }

      return res.status(404).json({ message: 'Car was not found' });
    })
    .patch(async (req, res, next) => {
      let result;
      try {
        result = await CarController.updateCar(req.params.carId, req.body);
      } catch (err) {
        return next(err);
      }

      if (result) {
        res.sendStatus(204);
      }

      return res.status(404).json({ message: 'Car was not found' });
    })
    .delete(async (req, res, next) => {
      let result;
      try {
        result = await CarController.deleteCar(req.params.carId);
      } catch (err) {
        return next(err);
      }

      if (result) {
        return res.sendStatus(204);
      }

      return res.status(404).json({ message: 'Car was not found' });
    });

  app.use(router);
};

export default configureRoutes;