import { Commander } from '@aomex/commander';
import { schedule } from '../../../src';

export const commander = new Commander();

commander.create('schedule:m', {
  mount: [
    schedule({
      second: '*/2',
    }),
  ],
  action: () => {
    console.log('schedule:ok');
  },
});
