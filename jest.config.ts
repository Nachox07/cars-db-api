export default {
  testEnvironment: 'node',
  resetModules: true,
  testMatch: ['**/?(*.)(test).ts'],
  testPathIgnorePatterns: [],
  collectCoverageFrom: ['src/**/*.ts'],
  coverageDirectory: '<rootDir>/coverage',
  transform: { '^.+\\.(ts)?$': 'ts-jest' },
};
