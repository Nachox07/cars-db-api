import { ValidateFunction } from 'express-json-validator-middleware';
import validator from '../validator';

const schemaWithObjectIdProp: ValidateFunction = {
  type: 'object',
  properties: {
    carId: {
      type: 'string',
      objectId: true,
    },
  },
};

// @ts-ignore ajv does not take part of the type
const validate = validator.ajv.compile(schemaWithObjectIdProp);

describe('validator validate Object ID', () => {
  it('return false if value is not an Object ID', () => {
    expect(
      validate({
        carId: '123',
      }),
    ).toEqual(false);
  });

  it('return true if value is an Object ID', () => {
    expect(
      validate({
        carId: '608a797784a5a6beff177f84',
      }),
    ).toEqual(true);
  });
});
