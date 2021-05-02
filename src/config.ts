const configuration = {
  apiKey: process.env.API_KEY,
  databaseUrl: process.env.DATABASE_URL || 'mongodb://localhost:27017/cars-db',
};

export default configuration;
