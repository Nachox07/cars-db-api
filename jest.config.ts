export default {
  collectCoverageFrom: ['src/**/*.ts'],
  coverageReporters: [
    [
      'json',
      {
        file:
          process.env.TEST_TYPE === 'unit' ? 'unit.json' : 'integration.json',
      },
    ],
  ],
  coverageDirectory: '<rootDir>/coverage',
  coveragePathIgnorePatterns: ['index.ts', 'cacheMiddleware.ts'],
  resetModules: process.env.TEST_TYPE === 'unit',
  setupFiles: process.env.TEST_TYPE === 'unit' ? [`./test/mocks.ts`] : [],
  testEnvironment: 'node',
  testMatch: ['**/?(*.)(test|spec).ts'],
  testPathIgnorePatterns: [],
  transform: { '^.+\\.(ts)?$': 'ts-jest' },
};
