import { Commander } from '@aomex/console';
import { cron } from '../../../src';

export const commander = new Commander();

commander.create('schedule:m', {
  mount: [
    cron({
      second: '*/2',
    }),
  ],
  action: () => {
    console.log('schedule:ok');
  },
});
