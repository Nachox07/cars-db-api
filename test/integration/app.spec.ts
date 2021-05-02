import { Server } from 'http';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { init, close } from '../../src/server';
import { Car, ICar } from '../../src/models/car.model';
import config from '../../src/config';

process.env.API_KEY = '123456';

let app: Server | null;
let mongod: MongoMemoryServer;

const nonExistingCarId = '608b9d7a695ef436ccda19a5';
const mockCar = {
  brand: 'BMW',
  carModel: 'Series 4',
  color: 'Dark blue',
  specs: ['M Package'],
  year: 2016,
} as ICar;
const mockCar2 = {
  brand: 'Mercedes',
  carModel: 'A Class',
  color: 'White',
  specs: ['AMG Package', 'Tinted Windows'],
  year: 2021,
} as ICar;

// set API key to use during tests
config.apiKey = '123456';

describe('cars-db-api integration test', () => {
  beforeEach(async () => {
    mongod = new MongoMemoryServer();

    const uri = await mongod.getUri();

    // set databaseUrl as it will change for every test (random port, db name)
    config.databaseUrl = uri;

    process.env.DATABASE_URL = uri;

    app = await init();
  });

  afterEach(async () => {
    close();
    await mongod.stop();
  }, 5000);

  describe('authorization', () => {
    it('return unauthorized when x-api-key is not present', async () => {
      const { body } = await request(app)
        .get(`/cars`)
        .set('Accept', 'application/json')
        .expect(401);

      expect(body).toEqual({
        error: 'Authorization information needs to be provided',
      });
    });

    it('return forbidden when x-api-key is not valid', async () => {
      const { body } = await request(app)
        .get(`/cars`)
        .set('Accept', 'application/json')
        .set('x-api-key', 'invalid-api-key')
        .expect(403);

      expect(body).toEqual({ error: 'Wrong authorization key' });
    });

    it('return unauthorized when x-api-key is not present', async () => {
      const { body } = await request(app)
        .get(`/cars`)
        .set('Accept', 'application/json')
        .set('x-api-key', process.env.API_KEY as string)
        .expect(200);

      expect(body).toEqual([]);
    });
  });

  describe('add car action', () => {
    it('add a car to db', async () => {
      let carId = '';

      // add a car to the DB
      const { body: addBody } = await request(app)
        .post('/cars')
        .send(mockCar)
        .set('Accept', 'application/json')
        .set('x-api-key', process.env.API_KEY as string)
        .expect(201);

      expect(addBody).toEqual(
        expect.objectContaining({
          __v: 0,
          ...mockCar,
        }),
      );

      carId = addBody._id;

      // can retrieve added car with the same properties
      const { body: getBody } = await request(app)
        .get(`/cars/${carId}`)
        .set('Accept', 'application/json')
        .set('x-api-key', process.env.API_KEY as string)
        .expect(200);

      expect(getBody).toEqual(
        expect.objectContaining({
          __v: 0,
          ...mockCar,
          _id: carId,
        }),
      );
    });

    it('can not add a car if payload is invalid', async () => {
      const { body } = await request(app)
        .post('/cars')
        .send({
          brand: 'Mercedes',
        })
        .set('Accept', 'application/json')
        .set('x-api-key', process.env.API_KEY as string)
        .expect(400);

      expect(body).toEqual({
        body: [
          {
            dataPath: '',
            keyword: 'required',
            message: "should have required property 'carModel'",
            params: {
              missingProperty: 'carModel',
            },
            schemaPath: '#/required',
          },
          {
            dataPath: '',
            keyword: 'required',
            message: "should have required property 'color'",
            params: {
              missingProperty: 'color',
            },
            schemaPath: '#/required',
          },
          {
            dataPath: '',
            keyword: 'required',
            message: "should have required property 'year'",
            params: {
              missingProperty: 'year',
            },
            schemaPath: '#/required',
          },
        ],
      });
    });
  });

  describe('delete car action', () => {
    it('delete a car from the db', async () => {
      const mockCreationDate = new Date();
      const carDoc = await new Car({
        ...mockCar,
        creationDate: mockCreationDate,
      }).save();

      // delete created car
      await request(app)
        .delete(`/cars/${carDoc._id}`)
        .set('Accept', 'application/json')
        .set('x-api-key', process.env.API_KEY as string)
        .expect(204);
    });

    it('do not delete a car when it does no exist on db', async () => {
      const { body } = await request(app)
        .delete(`/cars/${nonExistingCarId}`)
        .set('Accept', 'application/json')
        .set('x-api-key', process.env.API_KEY as string)
        .expect(404);

      expect(body).toEqual({ error: 'Car was not found' });
    });

    it('can not delete a car if car ID is invalid', async () => {
      const { body } = await request(app)
        .delete('/cars/123')
        .set('Accept', 'application/json')
        .set('x-api-key', process.env.API_KEY as string)
        .expect(400);

      expect(body).toEqual({
        params: [
          {
            dataPath: '.carId',
            keyword: 'objectId',
            message: 'should pass "objectId" keyword validation',
            params: {
              keyword: 'objectId',
            },
            schemaPath: '#/properties/carId/objectId',
          },
        ],
      });
    });
  });

  describe('get car by id action', () => {
    it('get a car from the db', async () => {
      const mockCreationDate = new Date();
      const carDoc = await new Car({
        ...mockCar,
        creationDate: mockCreationDate,
      }).save();

      // can retrieve added car with the same properties
      const { body } = await request(app)
        .get(`/cars/${carDoc._id}`)
        .set('Accept', 'application/json')
        .set('x-api-key', process.env.API_KEY as string)
        .expect(200);

      expect(body).toEqual(expect.objectContaining(mockCar));
      expect(body.creationDate).toEqual(mockCreationDate.toISOString());
      expect(body._id).toEqual(carDoc._id.toString());
    });

    it('do not get a car when it does no exist on db', async () => {
      const { body } = await request(app)
        .get(`/cars/${nonExistingCarId}`)
        .set('Accept', 'application/json')
        .set('x-api-key', process.env.API_KEY as string)
        .expect(404);

      expect(body).toEqual({ error: 'Car was not found' });
    });

    it('can not get a car if car ID is invalid', async () => {
      const { body } = await request(app)
        .get('/cars/123')
        .set('Accept', 'application/json')
        .set('x-api-key', process.env.API_KEY as string)
        .expect(400);

      expect(body).toEqual({
        params: [
          {
            dataPath: '.carId',
            keyword: 'objectId',
            message: 'should pass "objectId" keyword validation',
            params: {
              keyword: 'objectId',
            },
            schemaPath: '#/properties/carId/objectId',
          },
        ],
      });
    });
  });

  describe('get cars action', () => {
    it('get an empty array when there are no cars added', async () => {
      const { body } = await request(app)
        .get(`/cars`)
        .set('Accept', 'application/json')
        .set('x-api-key', process.env.API_KEY as string)
        .expect(200);

      expect(body).toEqual([]);
    });

    it('get all the cars meta-data from the db', async () => {
      const mockCreationDate = new Date();
      const carDoc = await new Car({
        ...mockCar,
        creationDate: mockCreationDate,
      }).save();
      const carDoc2 = await new Car({
        ...mockCar2,
        creationDate: mockCreationDate,
      }).save();

      // can retrieve added car with the same properties
      const { body } = await request(app)
        .get(`/cars`)
        .set('Accept', 'application/json')
        .set('x-api-key', process.env.API_KEY as string)
        .expect(200);

      expect(body[0]).toEqual({
        _id: carDoc._id.toString(),
        creationDate: mockCreationDate.toISOString(),
        __v: 0,
      });
      expect(body[1]).toEqual({
        _id: carDoc2._id.toString(),
        creationDate: mockCreationDate.toISOString(),
        __v: 0,
      });
      expect(body.length).toEqual(2);
    });
  });

  describe('update car action', () => {
    const mockUpdatePayload: Partial<ICar> = {
      carModel: 'Series 5',
      specs: ['Luxury Package'],
    };

    it('update a car in the db with the given payload', async () => {
      const mockCreationDate = new Date();
      const carDoc = await new Car({
        ...mockCar,
        creationDate: mockCreationDate,
      }).save();

      // update created car
      await request(app)
        .patch(`/cars/${carDoc._id}`)
        .send(mockUpdatePayload)
        .set('Accept', 'application/json')
        .set('x-api-key', process.env.API_KEY as string)
        .expect(204);

      // retrieve the car with properties updated
      const { body } = await request(app)
        .get(`/cars/${carDoc._id}`)
        .send(mockUpdatePayload)
        .set('Accept', 'application/json')
        .set('x-api-key', process.env.API_KEY as string)
        .expect(200);

      expect(body).toEqual(expect.objectContaining(mockUpdatePayload));
    });

    it('do not update a car when it does no exist on db', async () => {
      const { body } = await request(app)
        .patch(`/cars/${nonExistingCarId}`)
        .send(mockUpdatePayload)
        .set('Accept', 'application/json')
        .set('x-api-key', process.env.API_KEY as string)
        .expect(404);

      expect(body).toEqual({ error: 'Car was not found' });
    });

    it('can not update a car if car ID is invalid', async () => {
      const { body } = await request(app)
        .patch('/cars/123')
        .set('Accept', 'application/json')
        .set('x-api-key', process.env.API_KEY as string)
        .expect(400);

      expect(body).toEqual({
        params: [
          {
            keyword: 'objectId',
            dataPath: '.carId',
            schemaPath: '#/properties/carId/objectId',
            params: {
              keyword: 'objectId',
            },
            message: 'should pass "objectId" keyword validation',
          },
        ],
        body: [
          {
            keyword: 'required',
            dataPath: '',
            schemaPath: '#/anyOf/0/required',
            params: {
              missingProperty: 'brand',
            },
            message: "should have required property 'brand'",
          },
          {
            keyword: 'required',
            dataPath: '',
            schemaPath: '#/anyOf/1/required',
            params: {
              missingProperty: 'carModel',
            },
            message: "should have required property 'carModel'",
          },
          {
            keyword: 'required',
            dataPath: '',
            schemaPath: '#/anyOf/2/required',
            params: {
              missingProperty: 'color',
            },
            message: "should have required property 'color'",
          },
          {
            keyword: 'required',
            dataPath: '',
            schemaPath: '#/anyOf/3/required',
            params: {
              missingProperty: 'specs',
            },
            message: "should have required property 'specs'",
          },
          {
            keyword: 'required',
            dataPath: '',
            schemaPath: '#/anyOf/4/required',
            params: {
              missingProperty: 'year',
            },
            message: "should have required property 'year'",
          },
          {
            keyword: 'anyOf',
            dataPath: '',
            schemaPath: '#/anyOf',
            params: {},
            message: 'should match some schema in anyOf',
          },
        ],
      });
    });

    it('can not update update payload is invalid', async () => {
      const mockCreationDate = new Date();
      const carDoc = await new Car({
        ...mockCar,
        creationDate: mockCreationDate,
      }).save();

      const { body } = await request(app)
        .patch(`/cars/${carDoc._id}`)
        .send({ specs: {} })
        .set('Accept', 'application/json')
        .set('x-api-key', process.env.API_KEY as string)
        .expect(400);

      expect(body).toEqual({
        body: [
          {
            dataPath: '.specs',
            keyword: 'type',
            message: 'should be array',
            params: {
              type: 'array',
            },
            schemaPath: '#/properties/specs/type',
          },
        ],
      });
    });

    it('can not update update payload is empty', async () => {
      const mockCreationDate = new Date();
      const carDoc = await new Car({
        ...mockCar,
        creationDate: mockCreationDate,
      }).save();

      const { body } = await request(app)
        .patch(`/cars/${carDoc._id}`)
        .send({})
        .set('Accept', 'application/json')
        .set('x-api-key', process.env.API_KEY as string)
        .expect(400);

      expect(body).toEqual({
        body: [
          {
            keyword: 'required',
            dataPath: '',
            schemaPath: '#/anyOf/0/required',
            params: {
              missingProperty: 'brand',
            },
            message: "should have required property 'brand'",
          },
          {
            keyword: 'required',
            dataPath: '',
            schemaPath: '#/anyOf/1/required',
            params: {
              missingProperty: 'carModel',
            },
            message: "should have required property 'carModel'",
          },
          {
            keyword: 'required',
            dataPath: '',
            schemaPath: '#/anyOf/2/required',
            params: {
              missingProperty: 'color',
            },
            message: "should have required property 'color'",
          },
          {
            keyword: 'required',
            dataPath: '',
            schemaPath: '#/anyOf/3/required',
            params: {
              missingProperty: 'specs',
            },
            message: "should have required property 'specs'",
          },
          {
            keyword: 'required',
            dataPath: '',
            schemaPath: '#/anyOf/4/required',
            params: {
              missingProperty: 'year',
            },
            message: "should have required property 'year'",
          },
          {
            keyword: 'anyOf',
            dataPath: '',
            schemaPath: '#/anyOf',
            params: {},
            message: 'should match some schema in anyOf',
          },
        ],
      });
    });
  });
});
