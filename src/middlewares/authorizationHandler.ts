import { Handler } from 'express';
import config from '../config';
import { UnauthorizedError, ForbiddenError } from '../exceptions';

const authorizationHandler: Handler = (req, res, next) => {
  if (!('x-api-key' in req.headers)) {
    return next(
      new UnauthorizedError('Authorization information needs to be provided'),
    );
  }

  if (req.headers['x-api-key'] !== config.apiKey) {
    return next(new ForbiddenError('Wrong authorization key'));
  }

  return next();
};

export default authorizationHandler;
