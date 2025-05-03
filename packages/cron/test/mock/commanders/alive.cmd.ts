import { Commander } from '@aomex/console';
import { cron } from '../../../src';
import { sleep } from '@aomex/internal-tools';
import { appendFileSync } from 'node:fs';
import { join } from 'node:path';

export const commander = new Commander();

commander.create('schedule:alive', {
  mount: [
    cron({
      second: '*/2',
    }),
  ],
  action: async (ctx) => {
    const file = join(import.meta.dirname, 'alive.log');
    appendFileSync(file, 'start loop;');
    while (ctx.cron.isAlive()) {
      appendFileSync(file, 'in loop;');
      await sleep(300);
    }
    appendFileSync(file, 'exit loop;');
  },
});
