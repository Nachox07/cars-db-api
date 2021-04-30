import { Request, Response } from 'express';
import { DatabaseException } from '../exceptions';
import logger from '../logger';
import { exceptionHandler } from '../middlewares';

const mockStatus = jest.fn();
const mockSend = jest.fn();
const mockRes = {
  status: mockStatus.mockImplementation(() => {
    return { send: mockSend };
  }),
};

describe('exceptionHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('return the correct error for the DatabaseException exception', () => {
    exceptionHandler(
      new DatabaseException('DB related error'),
      {} as Request,
      (mockRes as unknown) as Response,
      () => {},
    );

    expect(logger.error).toHaveBeenCalledWith({
      message: 'DB related error',
      stack: `DatabaseException: DB related error
    at Object.<anonymous> (/Users/jruiz/Repositories/personal/cars-db-api/src/__tests__/middleware.test.ts:21:7)
    at Object.asyncJestTest (/Users/jruiz/Repositories/personal/cars-db-api/node_modules/jest-jasmine2/build/jasmineAsyncInstall.js:106:37)
    at /Users/jruiz/Repositories/personal/cars-db-api/node_modules/jest-jasmine2/build/queueRunner.js:45:12
    at new Promise (<anonymous>)
    at mapper (/Users/jruiz/Repositories/personal/cars-db-api/node_modules/jest-jasmine2/build/queueRunner.js:28:19)
    at /Users/jruiz/Repositories/personal/cars-db-api/node_modules/jest-jasmine2/build/queueRunner.js:75:41
    at processTicksAndRejections (internal/process/task_queues.js:93:5)`,
    });
    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockSend).toHaveBeenCalledWith(
      'Error while processing your request',
    );
  });

  it('return the default error when is an uncontrolled exception', () => {
    exceptionHandler(
      new Error('Random error'),
      {} as Request,
      (mockRes as unknown) as Response,
      () => {},
    );

    expect(logger.error).toHaveBeenCalledWith({
      message: 'Random error',
      stack: `Error: Random error
    at Object.<anonymous> (/Users/jruiz/Repositories/personal/cars-db-api/src/__tests__/middleware.test.ts:46:7)
    at Object.asyncJestTest (/Users/jruiz/Repositories/personal/cars-db-api/node_modules/jest-jasmine2/build/jasmineAsyncInstall.js:106:37)
    at /Users/jruiz/Repositories/personal/cars-db-api/node_modules/jest-jasmine2/build/queueRunner.js:45:12
    at new Promise (<anonymous>)
    at mapper (/Users/jruiz/Repositories/personal/cars-db-api/node_modules/jest-jasmine2/build/queueRunner.js:28:19)
    at /Users/jruiz/Repositories/personal/cars-db-api/node_modules/jest-jasmine2/build/queueRunner.js:75:41
    at processTicksAndRejections (internal/process/task_queues.js:93:5)`,
    });
    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockSend).toHaveBeenCalledWith('System error');
  });
});
