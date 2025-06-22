// jest.config.cjs
module.exports = {
  testEnvironment: 'node',
  // No transforms needed for native ESM
  transform: {},
  // Collect coverage only from public modules
  collectCoverageFrom: [
    'src/index.js',
    'src/pluginManager.js',
    'src/utils/**/*.js',
    'src/plugins/**/*.js'
  ],
  // (Optional) put reports in the same coverage folder
  coverageDirectory: 'coverage',
};
