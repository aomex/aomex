import { DEFAULT_PORT } from '../../src/lib/constant';

let counter = 100;

export const getPort = () => {
  return DEFAULT_PORT + ++counter;
};
