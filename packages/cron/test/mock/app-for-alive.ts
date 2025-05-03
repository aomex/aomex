import { commanders, ConsoleApp } from '@aomex/console';
import { crons } from '../../src';
import { join, relative } from 'node:path';

const commanderFile = relative(
  process.cwd(),
  join(import.meta.dirname, 'commanders', 'alive.cmd.ts'),
);

export const appForAlive = new ConsoleApp({
  mount: [
    crons({
      commanders: commanderFile,
      port: 4944,
    }),
    commanders(commanderFile),
  ],
});

if (process.argv.slice(2).join('') === 'schedule:alive') {
  await appForAlive.run('schedule:alive');
}
