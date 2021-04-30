import { Request, Response } from 'express';
import {
  DatabaseException,
  ForbiddenException,
  UnauthorizedException,
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

  it('return the correct error for the DatabaseException exception', () => {
    exceptionHandler(
      new DatabaseException('DB related error'),
      {} as Request,
      (mockRes as unknown) as Response,
      () => {},
    );

    expect(logger.error).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'DB related error',
      }),
    );
    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockSend).toHaveBeenCalledWith({
      error: 'Error while processing the request',
    });
  });

  it('return the correct error for the ForbiddenException exception', () => {
    exceptionHandler(
      new ForbiddenException('not enough permissions'),
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

  it('return the correct error for the UnauthorizedException exception', () => {
    exceptionHandler(
      new UnauthorizedException('user is unauthorized'),
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
