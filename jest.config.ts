export default {
  collectCoverageFrom: ['src/**/*.ts'],
  coverageDirectory: '<rootDir>/coverage',
  resetModules: true,
  setupFiles: [`./test/mocks.ts`],
  testEnvironment: 'node',
  testMatch: ['**/?(*.)(test|spec).ts'],
  testPathIgnorePatterns: [],
  transform: { '^.+\\.(ts)?$': 'ts-jest' },
};
