/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: ['src/app/**/*.ts', '!src/app/**/*.spec.ts', '!src/main.ts'],
  // The suite is a regression net, not a coverage trophy. Thresholds sit just
  // below the current level (74.76 / 57.61 / 64.46 / 76.71) so an accidental
  // coverage drop fails CI without blocking routine feature work.
  coverageThreshold: {
    global: {
      statements: 72,
      branches: 55,
      functions: 62,
      lines: 74,
    },
  },
  coverageReporters: ['text-summary', 'lcov', 'clover'],
};
