import { expect, test } from 'vitest';
import { cron } from '../../src';
import {
  ConsoleApp,
  ConsoleMiddleware,
  collectConsoleDocument,
  type ConsoleDocument,
} from '@aomex/console';

test('是中间件组', () => {
  expect(cron('')).toBeInstanceOf(ConsoleMiddleware);
});

test('文档', async () => {
  const docs: ConsoleDocument.Document = {};

  await collectConsoleDocument({
    document: docs,
    middlewareList: [cron('')],
    app: new ConsoleApp(),
  });
  expect(docs).toMatchInlineSnapshot(`
    {
      "cron:eject": {
        "summary": "导出定时任务列表",
      },
      "cron:start": {
        "summary": "启动定时任务",
      },
      "cron:stats": {
        "summary": "查看定时任务执行状态",
      },
      "cron:stop": {
        "summary": "退出定时任务",
      },
    }
  `);
});
