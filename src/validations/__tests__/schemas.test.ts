import validator from '../validator';
import { carSchema, carIdSchema, updateCarSchema } from '../schemas';

describe('schemas', () => {
  describe('carIdSchema', () => {
    // @ts-ignore ajv does not take part of the type
    const validate = validator.ajv.compile(carIdSchema);

    it('return true when object is valid', () => {
      expect(
        validate({
          carId: '608a797784a5a6beff177f84',
        }),
      ).toEqual(true);
    });

    it('return false when object is invalid', () => {
      expect(
        validate({
          carId: '123',
        }),
      ).toEqual(false);
    });
  });

  describe('carSchema', () => {
    // @ts-ignore ajv does not take part of the type
    const validate = validator.ajv.compile(carSchema);

    it('return true when object is valid', () => {
      expect(
        validate({
          brand: 'BMW',
          carModel: 'Series 4',
          color: 'Dark blue',
          year: 2016,
        }),
      ).toEqual(true);

      expect(
        validate({
          brand: 'BMW',
          carModel: 'Series 4',
          color: 'Dark blue',
          specs: ['M Package'],
          year: 2016,
        }),
      ).toEqual(true);
    });

    it('return false when object is invalid', () => {
      expect(
        validate({
          brand: 'BMW',
          carModel: 'Series 4',
          color: 'Dark blue',
          specs: ['M Package'],
        }),
      ).toEqual(false);
    });

    it('return false when specs fields contains duplicates', () => {
      expect(
        validate({
          brand: 'BMW',
          carModel: 'Series 4',
          color: 'Dark blue',
          specs: ['M Package', 'M Package'],
          year: 2016,
        }),
      ).toEqual(false);
    });
  });

  describe('updateCarSchema', () => {
    // @ts-ignore ajv does not take part of the type
    const validate = validator.ajv.compile(updateCarSchema);

    it('return true when object is valid', () => {
      expect(
        validate({
          brand: 'BMW',
        }),
      ).toEqual(true);

      expect(
        validate({
          specs: ['M Package'],
        }),
      ).toEqual(true);
    });

    it('return false when object is invalid', () => {
      expect(
        validate({
          brand: 123,
          specs: ['M Package'],
        }),
      ).toEqual(false);
    });

    it('return false when specs fields contains duplicates', () => {
      expect(
        validate({
          specs: ['M Package', 'M Package'],
        }),
      ).toEqual(false);
    });
  });
});
