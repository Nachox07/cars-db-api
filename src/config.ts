const configuration = {
  apiKey: process.env.API_KEY,
  databaseUrl: process.env.DATABASE_URL || 'mongodb://localhost:27017/cars-db',
  swaggerEnabled: process.env.SWAGGER_ENABLED || false,
  server: {
    port: process.env.SERVER_PORT || 8080,
  },
};

export default configuration;
