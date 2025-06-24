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
    'src/index.ts',
    'src/pluginManager.ts',
    'src/utils/**/*.ts',
    'src/plugins/**/*.ts'
  ],
  coverageDirectory: 'coverage'
};
