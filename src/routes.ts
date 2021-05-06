import { Application, Router } from 'express';
import mongoose from 'mongoose';
import apicache from 'apicache';
import CarController from './controllers/car.controller';
import validator from './validations/validator';
import { carIdSchema, carSchema, updateCarSchema } from './validations/schemas';
import {
  ConflictError,
  NotFoundError,
  ServiceUnavailableError,
} from './exceptions';
import authorizationHandler from './middlewares/authorizationHandler';
import config from './config';
import cache from './middlewares/cacheMiddleware';

const router = Router();

const configureRoutes = async (app: Application) => {
  app
    .route('/cars')
    .get(authorizationHandler, cache('5 minutes'), async (req, res, next) => {
      let cars;

      try {
        cars = await CarController.getCars();
      } catch (err) {
        return next(err);
      }

      return res.send(cars);
    })
    .post(
      authorizationHandler,
      validator.validate({ body: carSchema }),
      async (req, res, next) => {
        let carDoc;

        try {
          carDoc = await CarController.addCar(req.body);
        } catch (err) {
          return next(err);
        }

        if (carDoc) {
          res.location(`http://localhost:8080/cars/${carDoc?._id}`);

          apicache.clear(['/cars']);
          apicache.clear([`/cars/${carDoc?._id}`]);

          return res.status(201).json(carDoc);
        }

        return next(
          new ConflictError('There was an error processing your request'),
        );
      },
    );

  app
    .route('/cars/:carId')
    .get(
      authorizationHandler,
      validator.validate({ params: carIdSchema }),
      cache('5 minutes'),
      async (req, res, next) => {
        let result;

        try {
          result = await CarController.getCar(req.params.carId);
        } catch (err) {
          return next(err);
        }

        if (result) {
          return res.send(result);
        }

        return next(new NotFoundError('Car was not found'));
      },
    )
    .patch(
      authorizationHandler,
      validator.validate({ params: carIdSchema, body: updateCarSchema }),
      async (req, res, next) => {
        let result;

        try {
          result = await CarController.updateCar(req.params.carId, req.body);

          apicache.clear(['/cars']);
          apicache.clear([`/cars/${req.params.carId}`]);
        } catch (err) {
          return next(err);
        }

        if (result) {
          return res.sendStatus(204);
        }

        return next(new NotFoundError('Car was not found'));
      },
    )
    .delete(
      authorizationHandler,
      validator.validate({ params: carIdSchema }),
      async (req, res, next) => {
        let result;
        try {
          result = await CarController.deleteCar(req.params.carId);

          apicache.clear(['/cars']);
          apicache.clear([`/cars/${req.params.carId}`]);
        } catch (err) {
          return next(err);
        }

        if (result) {
          return res.sendStatus(204);
        }

        return next(new NotFoundError('Car was not found'));
      },
    );

  app.get('/healthcheck', cache('1 minutes'), async (_req, res, next) => {
    const healthcheck = {
      uptime: process.uptime(),
      message: 'OK',
      timestamp: Date.now(),
      databaseConnectionStatus: mongoose.connection.readyState
        ? 'connected'
        : 'disconnected',
      ...(process.env.NODE_ENV !== 'production' ? { appConfig: config } : {}),
    };
    try {
      return res.send(healthcheck);
    } catch (e) {
      return next(new ServiceUnavailableError(e));
    }
  });

  app.use(router);
};

export default configureRoutes;
