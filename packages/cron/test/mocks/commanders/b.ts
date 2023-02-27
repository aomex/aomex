import { Commander } from '@aomex/console-router';
import { writeFileSync } from 'fs';
import path from 'path';
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
  action(ctx) {
    const file = path.resolve(
      'test',
      '__temp__',
      `auto-by-worker-${Math.random()}.txt`,
    );
    writeFileSync(file, Date.now() + '\n' + ctx.request.argv.join(' '));
  },
});
