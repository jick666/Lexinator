// jest.config.cjs
const tsPreset = require('ts-jest/presets/default-esm/jest-preset');

module.exports = {
  ...tsPreset,
  globals: {
    'ts-jest': { diagnostics: false }
  },
  testEnvironment: 'node',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  collectCoverageFrom: [
    'src/index.js',
    'src/pluginManager.js',
    'src/utils/**/*.js',
    'src/plugins/**/*.js'
  ],
  coverageDirectory: 'coverage'
};
