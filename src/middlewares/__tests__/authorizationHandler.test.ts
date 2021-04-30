import { Request, Response } from 'express';
import { ForbiddenException, UnauthorizedException } from '../../exceptions';
import authorizationHandler from '../authorizationHandler';

const mockNext = jest.fn();

process.env.API_KEY = '123456';

describe('authorizationHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throw UnauthorizedException when the header is not present', () => {
    authorizationHandler({ headers: {} } as Request, {} as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      new UnauthorizedException(
        'Authorization information needs to be provided',
      ),
    );
  });

  it('throw ForbiddenException when the header is present, but API key is not valid', () => {
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
      new ForbiddenException('Wrong Authorization Key'),
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
