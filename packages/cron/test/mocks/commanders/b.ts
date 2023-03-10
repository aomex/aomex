import { Commander } from '@aomex/commander';
import { schedule } from '../../../src';

export const commander = new Commander();

commander.create('test:second', {
  mount: [
    schedule({
      second: '*',
      minute: '*',
      args: ['--hello', 'test'],
    }),
    schedule({
      second: '*/4',
      minute: '*/2',
    }),
  ],
  action() {},
});
