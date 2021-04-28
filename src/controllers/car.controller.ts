import logger from '../logger';
import { ICar, Car } from '../models/car.model';

const CarController = {
  addCar: async (car: ICar) => {
    let carDoc: ICar | null = null;

    try {
      carDoc = await new Car(car).save();

      logger.info(`New car added  ${carDoc._id}`);
    } catch (err) {
      logger.error({ message: 'Error while adding a new car', err });
    }

    return carDoc?._id;
  },
  deleteCar: (carId: string) => {},
  getCar: (carId: string) => {},
  getCars: () => {},
  updateCar: (carId: string) => {},
};

export default CarController;
