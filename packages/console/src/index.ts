export * from './utils';
export * from './cli';
export * from './override';
export * from './middleware/options';
export * from './commander';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      AOMEX_CLI_MODE?: '1';
    }
  }
}
