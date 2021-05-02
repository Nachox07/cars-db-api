import mongoose from 'mongoose';
import config from '../config';
import logger from '../logger';

export const createDbConnection = async () => {
  logger.info(`Initialising DB connection ${config.databaseUrl}`);

  try {
    await mongoose.connect(config.databaseUrl, {
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    logger.info('DB connection initialised');
  } catch (err) {
    logger.error({ message: 'DB connection error', err });
  }
};

export const closeDbConnection = async () => {
  await mongoose.disconnect();
};
