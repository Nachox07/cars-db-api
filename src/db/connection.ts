import mongoose from 'mongoose';
import logger from '../logger';

export const createDbConnection = async () => {
  logger.info('Initialising DB connection');

  try {
    await mongoose.connect(
      process.env.DATABASE_URL || `mongodb://localhost:27017/cars-db`,
      {
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    );

    logger.info('DB connection initialised');
  } catch (err) {
    logger.error({ message: 'DB connection error', err });
  }
};

export const closeDbConnection = async () => {
  await mongoose.disconnect();
};
