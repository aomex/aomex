import { Commander } from '@aomex/console';
import { cron } from '../../../src';

export const commander = new Commander();

commander.create('schedule:a', {
  mount: [
    cron({
      second: '*/10',
    }),
  ],
  action: () => {},
});

commander.create('schedule:b', {
  action: () => {},
});

commander.create('schedule:c', {
  mount: [cron({})],
  action: () => {},
});
