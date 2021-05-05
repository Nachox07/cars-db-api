import { ConflictError } from '../exceptions';
import logger from '../logger';
import { ICar, Car } from '../models/car.model';

const carSpecsHaveDuplicates = (specs: ICar['specs'] | undefined) =>
  specs && new Set(specs).size !== specs.length;

const CarController = {
  addCar: async (car: ICar) => {
    let carDoc: ICar | null = null;

    try {
      // Check specs has no duplicates
      if (carSpecsHaveDuplicates(car?.specs))
        throw new Error('specs has duplicates');

      carDoc = await new Car({
        ...car,
        creationDate: new Date(),
      }).save();

      logger.info({ message: `New car added`, carDoc });
    } catch (err) {
      throw new ConflictError(`Error while adding a new car`);
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
      throw new ConflictError(`Error while deleting car`);
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
      throw new ConflictError(`Error while getting car`);
    }

    return carDoc;
  },
  getCars: async () => {
    let carDocs: ICar[] | null = null;

    try {
      carDocs = await Car.aggregate([
        {
          $project: {
            creationDate: 1,
            _id: 1,
            __v: 1,
          },
        },
      ]).exec();

      logger.info({ message: 'Getting cars collection' });
    } catch (err) {
      throw new ConflictError(`Error while getting cars collection`);
    }

    return carDocs;
  },
  updateCar: async (carId: ICar['_id'], car: Partial<ICar>) => {
    let result: boolean = false;

    try {
      // Check specs has no duplicates
      if (carSpecsHaveDuplicates(car.specs))
        throw new Error('specs has duplicates');

      result = Boolean(await Car.findByIdAndUpdate(carId, car));

      if (result) {
        logger.info({ message: `car updated ${carId}` });
      }
    } catch (err) {
      throw new ConflictError(`Error while updating car`);
    }

    return result;
  },
};

export default CarController;
