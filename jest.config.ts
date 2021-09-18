import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.spec.[jt]s?(x)'],
  preset: 'ts-jest',
  collectCoverage: true,
  coverageReporters: ['lcov', 'text'],
};

export default config;
