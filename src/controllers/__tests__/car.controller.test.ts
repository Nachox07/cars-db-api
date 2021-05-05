import {
  mockCarAggregateExec,
  mockCarConstructor,
  mockCarFindById,
  mockCarFindByIdAndDelete,
  mockCarFindByIdAndUpdate,
  mockCarSave,
} from '../../../test/mocks';
import { useTimeMock } from '../../../test/utils';
import { ICar } from '../../models/car.model';
import CarController from '../car.controller';
import logger from '../../logger';

const mockDateString = '2021-01-01T12:45:00.000Z';
const mockDate = new Date(mockDateString);
const mockCarId = 'mock-car-id';
const mockCar = {
  brand: 'BMW',
  carModel: 'Series 3',
  color: 'Dark blue',
  specs: ['M Package'],
  year: 2016,
} as ICar;
const carCreatedMock = {
  creationDate: mockDate,
  ...mockCar,
};

useTimeMock(mockDateString);

describe('CarController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addCar', () => {
    it('add a car successfully', async () => {
      mockCarSave.mockImplementation(() => carCreatedMock);

      expect(await CarController.addCar(mockCar)).toEqual(carCreatedMock);
      expect(mockCarConstructor).toHaveBeenCalledWith({
        creationDate: mockDate,
        ...mockCar,
      });
      expect(mockCarSave).toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalledWith({
        carDoc: {
          brand: 'BMW',
          carModel: 'Series 3',
          color: 'Dark blue',
          creationDate: mockDate,
          specs: ['M Package'],
          year: 2016,
        },
        message: 'New car added',
      });
    });

    it('throw controlled exception if specs has duplicates', async () => {
      await expect(
        CarController.addCar({
          ...mockCar,
          specs: ['M Package', 'M Package'],
        } as ICar),
      ).rejects.toThrow('Error while adding a new car');
    });

    it('throw controlled exception if something goes wrong', async () => {
      mockCarSave.mockImplementation(() =>
        Promise.reject(new Error('Unexpected error')),
      );

      await expect(CarController.addCar(mockCar)).rejects.toThrow(
        'Error while adding a new car',
      );
    });
  });

  describe('deleteCar', () => {
    it('return true when delete a car action is successfull', async () => {
      mockCarFindByIdAndDelete.mockImplementation(() => ({
        result: 'success',
      }));

      expect(await CarController.deleteCar(mockCarId)).toEqual(true);
      expect(logger.info).toHaveBeenCalledWith({
        message: 'Car deleted mock-car-id',
      });
    });

    it('return false when the car does not exist', async () => {
      mockCarFindByIdAndDelete.mockImplementation(() => null);

      expect(await CarController.deleteCar(mockCarId)).toEqual(false);
      expect(logger.info).toHaveBeenCalledTimes(0);
    });

    it('throw controlled exception if something goes wrong', async () => {
      mockCarFindByIdAndDelete.mockImplementation(() =>
        Promise.reject(new Error('Unexpected error')),
      );

      await expect(CarController.deleteCar(mockCarId)).rejects.toThrow(
        'Error while deleting car',
      );
    });
  });

  describe('getCar', () => {
    it('return true when get a car', async () => {
      mockCarFindById.mockImplementation(() => carCreatedMock);

      expect(await CarController.getCar(mockCarId)).toEqual(carCreatedMock);
      expect(logger.info).toHaveBeenCalledWith({
        message: 'getting car mock-car-id',
      });
    });

    it('return false when the car does not exist', async () => {
      mockCarFindById.mockImplementation(() => null);

      expect(await CarController.getCar(mockCarId)).toEqual(null);
      expect(logger.info).toHaveBeenCalledTimes(0);
    });

    it('throw controlled exception if something goes wrong', async () => {
      mockCarFindById.mockImplementation(() =>
        Promise.reject(new Error('Unexpected error')),
      );

      await expect(CarController.getCar(mockCarId)).rejects.toThrow(
        'Error while getting car',
      );
    });
  });

  describe('getCars', () => {
    it('return true when delete a car action is successfull', async () => {
      mockCarAggregateExec.mockImplementation(() => []);

      expect(await CarController.getCars()).toEqual([]);
      expect(logger.info).toHaveBeenCalledWith({
        message: 'Getting cars collection',
      });
    });

    it('throw controlled exception if something goes wrong', async () => {
      mockCarAggregateExec.mockImplementation(() =>
        Promise.reject(new Error('Unexpected error')),
      );

      await expect(CarController.getCars()).rejects.toThrow(
        'Error while getting cars collection',
      );
    });
  });

  describe('updateCar', () => {
    it('return true when get a car', async () => {
      const mockCarFindByIdAndUpdateResult = {
        result: 'success',
      };

      mockCarFindByIdAndUpdate.mockImplementation(
        () => mockCarFindByIdAndUpdateResult,
      );

      expect(await CarController.updateCar(mockCarId, mockCar)).toEqual(true);
      expect(logger.info).toHaveBeenCalledWith({
        message: 'car updated mock-car-id',
      });
    });

    it('return false when the car does not exist', async () => {
      mockCarFindByIdAndUpdate.mockImplementation(() => null);

      expect(await CarController.updateCar(mockCarId, mockCar)).toEqual(false);
      expect(logger.info).toHaveBeenCalledTimes(0);
    });

    it('throw controlled exception if specs contain duplicates', async () => {
      await expect(
        CarController.updateCar(mockCarId, {
          specs: ['M Package', 'M Package'],
        }),
      ).rejects.toThrow('Error while updating car');
    });

    it('throw controlled exception if something goes wrong', async () => {
      mockCarFindByIdAndUpdate.mockImplementation(() =>
        Promise.reject(new Error('Unexpected error')),
      );

      await expect(CarController.updateCar(mockCarId, mockCar)).rejects.toThrow(
        'Error while updating car',
      );
    });
  });
});
