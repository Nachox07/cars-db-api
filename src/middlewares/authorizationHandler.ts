import { Handler } from 'express';
import { UnauthorizedException, ForbiddenException } from '../exceptions';

const authorizationHandler: Handler = (req, res, next) => {
  if (!('x-api-key' in req.headers)) {
    return next(
      new UnauthorizedException(
        'Authorization information needs to be provided',
      ),
    );
  }

  if (req.headers['x-api-key'] !== process.env.API_KEY) {
    return next(new ForbiddenException('Wrong authorization key'));
  }

  return next();
};

export default authorizationHandler;
