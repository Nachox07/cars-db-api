import { DatabaseException } from '../exceptions';
import logger from '../logger';
import { ICar, Car } from '../models/car.model';

const CarController = {
  addCar: async (car: ICar) => {
    let carDoc: ICar | null = null;

    try {
      carDoc = await new Car({
        ...car,
        creationDate: new Date(),
      }).save();

      logger.info({ message: `New car added`, carDoc });
    } catch (err) {
      throw new DatabaseException('Error while adding a new car', err);
    }

    return carDoc;
  },
  deleteCar: async (carId: ICar['_id']) => {
    let result: boolean = false;

    try {
      result = Boolean(await Car.findByIdAndDelete(carId));

      if (result) {
        logger.info({ message: `Car deleted ${carId}` });
      }
    } catch (err) {
      throw new DatabaseException('Error while deleting car', err);
    }

    return result;
  },
  getCar: async (carId: ICar['_id']) => {
    let carDoc: ICar | null = null;

    try {
      carDoc = await Car.findById(carId);

      if (carDoc) {
        logger.info({ message: `getting car ${carId}` });
      }
    } catch (err) {
      throw new DatabaseException('Error while getting car', err);
    }

    return carDoc;
  },
  getCars: async () => {
    let carDocs: ICar[] | null = null;

    try {
      carDocs = await Car.aggregate([
        {
          $project: {
            _id: 1,
            brand: 0,
            carModel: 0,
            color: 0,
            specs: 0,
            year: 0,
          },
        },
      ]).exec();

      logger.info({ message: 'Getting cars collection' });
    } catch (err) {
      throw new DatabaseException('Error while getting cars collection', err);
    }

    return carDocs;
  },
  updateCar: async (carId: ICar['_id'], car: Omit<ICar, ICar['_id']>) => {
    let result: boolean = false;

    try {
      result = Boolean(await Car.findByIdAndUpdate(carId, car));

      if (result) {
        logger.info({ message: `car updated ${carId}` });
      }
    } catch (err) {
      throw new DatabaseException('Error while updating car', err);
    }

    return result;
  },
};

export default CarController;
