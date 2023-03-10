import { Commander } from '@aomex/commander';
import { schedule } from '../../../src';

export const commander = new Commander();

commander.create('test:a', {
  mount: [
    schedule({}),
    schedule({
      month: '2-3',
      dayOfMonth: '*',
    }),
  ],
  action() {},
});

export default schedule({
  second: '1,2,3,4',
});
