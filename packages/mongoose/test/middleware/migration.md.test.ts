import { TestConsoleApp } from '../../../console/src/testing';
import {
  ConsoleMiddleware,
  type ConsoleDocument,
  collectConsoleDocument,
} from '@aomex/console';
import { test, expect } from 'vitest';
import { mongooseMigration } from '../../src';
import mongoose from 'mongoose';
test('是中间件组', () => {
  expect(mongooseMigration({ connection: mongoose.connection })).toBeInstanceOf(
    ConsoleMiddleware,
  );
});

test('文档', async () => {
  const docs: ConsoleDocument.Document = {};

  await collectConsoleDocument({
    document: docs,
    middlewareList: [mongooseMigration({ connection: mongoose.connection })],
    app: new TestConsoleApp({}),
  });
  expect(docs).toMatchInlineSnapshot(`
    {
      "mongoose:migration:create": {
        "parameters": [
          {
            "name": "name",
            "type": "string",
          },
        ],
        "summary": "创建迁移文件",
      },
      "mongoose:migration:down": {
        "parameters": [
          {
            "defaultValue": false,
            "name": "all",
            "type": "boolean",
          },
        ],
        "summary": "回滚迁移",
      },
      "mongoose:migration:up": {
        "summary": "执行迁移",
      },
    }
  `);
});
