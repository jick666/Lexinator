// jest.config.cjs
module.exports = {
  testEnvironment: 'node',
  // No transforms needed for native ESM
  transform: {},
  // Collect coverage from all your source files under src/
  collectCoverageFrom: ['src/**/*.js'],
  // (Optional) put reports in the same coverage folder
  coverageDirectory: 'coverage',
};
