import { Commander } from '@aomex/console';
import { cron } from '../../../src';
import { sleep } from '@aomex/internal-tools';

export const commander = new Commander();

commander.create('schedule:n', {
  mount: [
    cron({
      second: '*/2',
    }),
  ],
  action: async () => {
    await sleep(6000);
    console.log('schedule:n:ok');
  },
});

commander.create('schedule:t', {
  mount: [
    cron({
      second: '*/2',
    }),
  ],
  action: async () => {
    await sleep(4000);
    console.log('schedule:t:ok');
  },
});
