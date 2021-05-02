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
  additionalproperties: false,
  maxProperties: 5,
  minProperties: 4,
};

// At least one property must be passed
export const updateCarSchema: ValidateFunction = {
  ...carSchema,
  required: [],
  anyOf: [
    {
      required: ['brand'],
    },
    {
      required: ['carModel'],
    },
    {
      required: ['color'],
    },
    {
      required: ['specs'],
    },
    {
      required: ['year'],
    },
  ],
  additionalproperties: false,
  maxProperties: 5,
  minProperties: 1,
};
