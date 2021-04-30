import { ValidateFunction } from 'express-json-validator-middleware';

export const carIdSchema: ValidateFunction = {
  type: 'object',
  properties: {
    carId: {
      type: 'string',
      objectId: true,
    },
  },
};

export const carSchema: ValidateFunction = {
  type: 'object',
  required: ['brand', 'carModel', 'color', 'year'],
  properties: {
    brand: {
      type: 'string',
    },
    carModel: {
      type: 'string',
    },
    color: {
      type: 'string',
    },
    specs: {
      type: 'array',
      items: { type: 'string' },
      uniqueItems: true,
    },
    year: {
      type: 'number',
    },
  },
};

export const updateCarSchema: ValidateFunction = {
  ...carSchema,
  required: [],
};
