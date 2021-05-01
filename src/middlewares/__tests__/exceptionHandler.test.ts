import { Request, Response } from 'express';
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from '../../exceptions';
import logger from '../../logger';
import { exceptionHandler } from '../exceptionHandler';

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

  it('return the correct error for the Conflict exception', () => {
    exceptionHandler(
      new ConflictError('DB related error'),
      {} as Request,
      (mockRes as unknown) as Response,
      () => {},
    );

    expect(logger.error).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'DB related error',
      }),
    );
    expect(mockStatus).toHaveBeenCalledWith(409);
    expect(mockSend).toHaveBeenCalledWith({
      error: 'Error while processing the request',
    });
  });

  it('return the correct error for the Forbidden exception', () => {
    exceptionHandler(
      new ForbiddenError('not enough permissions'),
      {} as Request,
      (mockRes as unknown) as Response,
      () => {},
    );

    expect(logger.error).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'not enough permissions',
      }),
    );
    expect(mockStatus).toHaveBeenCalledWith(403);
    expect(mockSend).toHaveBeenCalledWith({
      error: 'Wrong authorization key',
    });
  });

  it('return the correct error for the NotFound exception', () => {
    exceptionHandler(
      new NotFoundError('custom not found error message'),
      {} as Request,
      (mockRes as unknown) as Response,
      () => {},
    );

    expect(logger.error).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'custom not found error message',
      }),
    );
    expect(mockStatus).toHaveBeenCalledWith(404);
    expect(mockSend).toHaveBeenCalledWith({
      error: 'custom not found error message',
    });
  });

  it('return the correct error for the UnauthorizedError exception', () => {
    exceptionHandler(
      new UnauthorizedError('user is unauthorized'),
      {} as Request,
      (mockRes as unknown) as Response,
      () => {},
    );

    expect(logger.error).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'user is unauthorized',
      }),
    );
    expect(mockStatus).toHaveBeenCalledWith(401);
    expect(mockSend).toHaveBeenCalledWith({
      error: 'Authorization information needs to be provided',
    });
  });

  it('return the default error when is an uncontrolled exception', () => {
    exceptionHandler(
      new Error('Random error'),
      {} as Request,
      (mockRes as unknown) as Response,
      () => {},
    );

    expect(logger.error).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Random error',
      }),
    );
    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockSend).toHaveBeenCalledWith({ error: 'System error' });
  });
});
