export default {
  collectCoverageFrom: ['src/**/*.ts'],
  coverageDirectory: '<rootDir>/coverage',
  resetModules: process.env.TEST_TYPE === 'unit',
  setupFiles: process.env.TEST_TYPE === 'unit' ? [`./test/mocks.ts`] : [],
  testEnvironment: 'node',
  testMatch: ['**/?(*.)(test|spec).ts'],
  testPathIgnorePatterns: [],
  transform: { '^.+\\.(ts)?$': 'ts-jest' },
};
