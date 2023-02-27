import { Commander } from '@aomex/console-router';
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
