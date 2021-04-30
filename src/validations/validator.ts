import mongoose from 'mongoose';
import { ValidateFunction, Validator } from 'express-json-validator-middleware';

const { ObjectId } = mongoose.Types;

const validator = new Validator({ allErrors: true });

// @ts-ignore ajv does not take part of the type
validator.ajv.addKeyword('objectId', {
  validate: (schema: ValidateFunction, data: string) => {
    return schema && ObjectId.isValid(data);
  },
  errors: false,
});

export default validator;
