import mongoose from 'mongoose';
import logger from '../logger';

const createDbConnection = async () => {
  logger.info('Initialising DB connection');

  try {
    await mongoose.connect('mongodb://localhost:27017/cars-db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    logger.info('DB connection initialised');
  } catch (err) {
    logger.error({ message: 'DB connection error', err });
  }
};

export default createDbConnection;
