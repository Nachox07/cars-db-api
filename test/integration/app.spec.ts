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

  describe('healthcheck', () => {
    it('return expected healthcheck info', async () => {
      const { body } = await request(app)
        .get(`/healthcheck`)
        .set('Accept', 'application/json')
        .expect(200);

      expect(body).toEqual(
        expect.objectContaining({
          appConfig: config,
          databaseConnectionStatus: 'connected',
          message: 'OK',
        }),
      );
      expect(body.timestamp).toBeDefined();
      expect(body.uptime).toBeDefined();
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
          ...mockCar,
          specs: ['M Package', 'M Package'],
        })
        .set('Accept', 'application/json')
        .set('x-api-key', process.env.API_KEY as string)
        .expect(400);

      expect(body).toEqual({
        body: [
          {
            dataPath: '.specs',
            keyword: 'uniqueItems',
            message:
              'should NOT have duplicate items (items ## 1 and 0 are identical)',
            params: {
              i: 0,
              j: 1,
            },
            schemaPath: '#/properties/specs/uniqueItems',
          },
        ],
      });
    });

    it('can not add a car if specs have duplicates', async () => {
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
            keyword: 'minProperties',
            message: 'should NOT have fewer than 4 properties',
            params: {
              limit: 4,
            },
            schemaPath: '#/minProperties',
          },
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
    it('get an empty when there are no cars added', async () => {
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

    it('do not update a car when specs have duplicates', async () => {
      const { body } = await request(app)
        .patch(`/cars/${nonExistingCarId}`)
        .send({ ...mockUpdatePayload, specs: ['M Package', 'M Package'] })
        .set('Accept', 'application/json')
        .set('x-api-key', process.env.API_KEY as string)
        .expect(400);

      expect(body).toEqual({
        body: [
          {
            dataPath: '.specs',
            keyword: 'uniqueItems',
            message:
              'should NOT have duplicate items (items ## 1 and 0 are identical)',
            params: {
              i: 0,
              j: 1,
            },
            schemaPath: '#/properties/specs/uniqueItems',
          },
        ],
      });
    });

    it('can not update a car if car ID is invalid', async () => {
      const { body } = await request(app)
        .patch('/cars/123')
        .set('Accept', 'application/json')
        .set('x-api-key', process.env.API_KEY as string)
        .expect(400);

      expect(body).toEqual({
        body: [
          {
            dataPath: '',
            keyword: 'minProperties',
            message: 'should NOT have fewer than 1 properties',
            params: {
              limit: 1,
            },
            schemaPath: '#/minProperties',
          },
          {
            dataPath: '',
            keyword: 'required',
            message: "should have required property 'brand'",
            params: {
              missingProperty: 'brand',
            },
            schemaPath: '#/anyOf/0/required',
          },
          {
            dataPath: '',
            keyword: 'required',
            message: "should have required property 'carModel'",
            params: {
              missingProperty: 'carModel',
            },
            schemaPath: '#/anyOf/1/required',
          },
          {
            dataPath: '',
            keyword: 'required',
            message: "should have required property 'color'",
            params: {
              missingProperty: 'color',
            },
            schemaPath: '#/anyOf/2/required',
          },
          {
            dataPath: '',
            keyword: 'required',
            message: "should have required property 'specs'",
            params: {
              missingProperty: 'specs',
            },
            schemaPath: '#/anyOf/3/required',
          },
          {
            dataPath: '',
            keyword: 'required',
            message: "should have required property 'year'",
            params: {
              missingProperty: 'year',
            },
            schemaPath: '#/anyOf/4/required',
          },
          {
            dataPath: '',
            keyword: 'anyOf',
            message: 'should match some schema in anyOf',
            params: {},
            schemaPath: '#/anyOf',
          },
        ],
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
            dataPath: '',
            keyword: 'minProperties',
            message: 'should NOT have fewer than 1 properties',
            params: {
              limit: 1,
            },
            schemaPath: '#/minProperties',
          },
          {
            dataPath: '',
            keyword: 'required',
            message: "should have required property 'brand'",
            params: {
              missingProperty: 'brand',
            },
            schemaPath: '#/anyOf/0/required',
          },
          {
            dataPath: '',
            keyword: 'required',
            message: "should have required property 'carModel'",
            params: {
              missingProperty: 'carModel',
            },
            schemaPath: '#/anyOf/1/required',
          },
          {
            dataPath: '',
            keyword: 'required',
            message: "should have required property 'color'",
            params: {
              missingProperty: 'color',
            },
            schemaPath: '#/anyOf/2/required',
          },
          {
            dataPath: '',
            keyword: 'required',
            message: "should have required property 'specs'",
            params: {
              missingProperty: 'specs',
            },
            schemaPath: '#/anyOf/3/required',
          },
          {
            dataPath: '',
            keyword: 'required',
            message: "should have required property 'year'",
            params: {
              missingProperty: 'year',
            },
            schemaPath: '#/anyOf/4/required',
          },
          {
            dataPath: '',
            keyword: 'anyOf',
            message: 'should match some schema in anyOf',
            params: {},
            schemaPath: '#/anyOf',
          },
        ],
      });
    });
  });
});
