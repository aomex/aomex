import { Commander } from '../../src';

export const commander = new Commander();

commander.create('aaa1', {
  action: () => {},
});

commander.create('aaa2', {
  action: () => {},
});

export const str = 'str';
export const num = 1;
export const obj = {};
