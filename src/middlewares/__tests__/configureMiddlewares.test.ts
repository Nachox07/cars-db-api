import { Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import configuration from '../../config';
import configureMiddlewares from '../configureMiddlewares';

jest.mock('swagger-ui-express');

const mockApp = {
  use: jest.fn(),
};

describe('configureMiddlewares', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('add Swagger middleware when swaggerEnabled is set to true', () => {
    configuration.swaggerEnabled = 'true';

    configureMiddlewares((mockApp as unknown) as Application);

    expect(swaggerUi.setup).toHaveBeenCalled();
  });

  it('does not add Swagger middleware when swaggerEnabled is set to false', () => {
    configuration.swaggerEnabled = 'false';

    configureMiddlewares((mockApp as unknown) as Application);

    expect(swaggerUi.setup).toHaveBeenCalledTimes(0);
  });
});
