import { expect, test, vitest } from 'vitest';
import { eject } from '../../src/middleware/eject.middleware';
import { dirname, join } from 'path';
import { middleware } from '@aomex/core';
import { ConsoleApp } from '@aomex/console';

const testDir = dirname(import.meta.dirname);

test('导出任务列表', async () => {
  const app = new ConsoleApp({
    mount: [
      eject({
        commanders: join(testDir, 'mock', 'commanders', 'eject.cmd.ts'),
      }),
    ],
  });

  const spy = vitest.spyOn(console, 'log').mockImplementation(() => {});
  await app.run('cron:eject');
  expect(spy).toHaveBeenCalledTimes(1);
  expect(spy).toHaveBeenLastCalledWith(
    `*/10 * * * * * aomex schedule:a
* * * * * aomex schedule:c`,
  );
  spy.mockRestore();
});

test('无效指令继续往后执行', async () => {
  const spy = vitest.fn();
  const app = new ConsoleApp({
    mount: [
      eject({
        commanders: join(testDir, '..', 'package.json'),
      }),
      middleware.console(spy),
    ],
  });
  await app.run('cron:eject');
  expect(spy).toHaveBeenCalledTimes(0);

  await app.run('cron:eject123');
  expect(spy).toHaveBeenCalledTimes(1);
});
