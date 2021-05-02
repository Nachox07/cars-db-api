import { Request, Response } from 'express';
import config from '../../config';
import { ForbiddenError, UnauthorizedError } from '../../exceptions';
import authorizationHandler from '../authorizationHandler';

const mockNext = jest.fn();

config.apiKey = '123456';

describe('authorizationHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throw UnauthorizedError when the header is not present', () => {
    authorizationHandler({ headers: {} } as Request, {} as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      new UnauthorizedError('Authorization information needs to be provided'),
    );
  });

  it('throw Forbidden when the header is present, but API key is not valid', () => {
    authorizationHandler(
      {
        headers: {
          'x-api-key': '123',
        } as Request['headers'],
      } as Request,
      {} as Response,
      mockNext,
    );

    expect(mockNext).toHaveBeenCalledWith(
      new ForbiddenError('Wrong authorization key'),
    );
  });

  it('continue execution when API key is valid', () => {
    authorizationHandler(
      {
        headers: {
          'x-api-key': '123456',
        } as Request['headers'],
      } as Request,
      {} as Response,
      mockNext,
    );

    expect(mockNext).toHaveBeenCalledWith();
  });
});
