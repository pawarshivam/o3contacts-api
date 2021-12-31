module.exports = {
  testEnvironment: 'node',
  setupFiles: [
    '<rootDir>/tests/setup.js',
  ],
  moduleNameMapper: {
    '^@root(.*)$': '<rootDir>$1',
    '^@globals(.*)$': '<rootDir>/globals$1',
    '^@loaders(.*)$': '<rootDir>/loaders$1',
    '^@models(.*)$': '<rootDir>/models$1',
    '^@utils(.*)$': '<rootDir>/utils$1',
    '^@routes(.*)$': '<rootDir>/routes$1',
    '^@bl(.*)$': '<rootDir>/bl$1',
    '^@tests(.*)$': '<rootDir>/tests$1',
  },
};
