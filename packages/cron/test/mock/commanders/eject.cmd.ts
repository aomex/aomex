import { Commander } from '@aomex/commander';
import { schedule } from '../../../src';

export const commander = new Commander();

commander.create('schedule:a', {
  mount: [
    schedule({
      second: '*/10',
    }),
  ],
  action: () => {},
});

commander.create('schedule:b', {
  action: () => {},
});

commander.create('schedule:c', {
  mount: [schedule({})],
  action: () => {},
});
