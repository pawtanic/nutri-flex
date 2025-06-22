// Set NODE_ENV to 'test' before all tests
process.env.NODE_ENV = 'test';

// Increase timeout for tests
jest.setTimeout(30000);

// Silence console logs during tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
