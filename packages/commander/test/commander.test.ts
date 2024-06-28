import { expect, test, vitest } from 'vitest';
import { Commander, commanders } from '../src';
import { middleware, rule } from '@aomex/core';
import { ConsoleApp, collectConsoleDocument, options } from '@aomex/console';

test('前缀', async () => {
  const commander = new Commander({ prefix: 'schedule:' });
  const spy = vitest.fn();
  commander.create('a', { action: spy });
  const app = new ConsoleApp({
    mount: [commanders([commander])],
  });

  await app.run('schedule:a');
  expect(spy).toHaveBeenCalledOnce();
});

test('挂载中间件组', async () => {
  let str = '';

  const commander = new Commander({
    mount: [
      middleware.console(async (_, next) => {
        str += 1;
        await next();
        str += 7;
      }),
    ],
  });
  commander.create('foo', {
    mount: [
      middleware.console(async (_, next) => {
        str += 2;
        await next();
        str += 6;
      }),
      middleware.console(async (_, next) => {
        str += 3;
        await next();
        str += 5;
      }),
    ],
    action: () => {
      str += 4;
    },
  });

  const app = new ConsoleApp({ mount: [commanders([commander])] });
  await app.run('foo');
  expect(str).toBe('1234567');
});

test('一个commander可注册多个command', async () => {
  const commander = new Commander({ prefix: 't:' });
  const spy1 = vitest.fn();
  const spy2 = vitest.fn();
  const spy3 = vitest.fn();
  commander.create('a', { action: spy1 });
  commander.create('b', { action: spy2 });
  commander.create('c', { action: spy3 });

  const app = new ConsoleApp({
    mount: [commanders([commander])],
  });

  await Promise.all([app.run('t:a'), app.run('t:b'), app.run('t:c'), app.run('t:a')]);
  expect(spy1).toHaveBeenCalledTimes(2);
  expect(spy2).toHaveBeenCalledTimes(1);
  expect(spy3).toHaveBeenCalledTimes(1);
});

test('文档', async () => {
  const commander = new Commander();
  commander.create('foo', {
    docs: {
      summary: 'foo-x',
      description: 'desc-bar',
      show: false,
    },
    mount: [
      options({
        id: rule.int(),
        name: rule.string(),
      }),
    ],
    action: () => {},
  });
  commander.create('bar', {
    mount: [
      options({
        id1: rule.int(),
        name1: rule.string(),
      }),
    ],
    action: () => {},
  });

  const doc = {};
  await collectConsoleDocument({
    document: doc,
    middlewareList: [commander['toMiddleware']()],
    app: new ConsoleApp(),
  });
  expect(doc).toMatchInlineSnapshot(`
    {
      "bar": {
        "parameters": [
          {
            "alias": undefined,
            "defaultValue": undefined,
            "deprecated": undefined,
            "description": undefined,
            "name": "id1",
            "type": "number",
          },
          {
            "alias": undefined,
            "defaultValue": undefined,
            "deprecated": undefined,
            "description": undefined,
            "name": "name1",
            "type": "string",
          },
        ],
        "show": true,
      },
      "foo": {
        "description": "desc-bar",
        "parameters": [
          {
            "alias": undefined,
            "defaultValue": undefined,
            "deprecated": undefined,
            "description": undefined,
            "name": "id",
            "type": "number",
          },
          {
            "alias": undefined,
            "defaultValue": undefined,
            "deprecated": undefined,
            "description": undefined,
            "name": "name",
            "type": "string",
          },
        ],
        "show": false,
        "summary": "foo-x",
      },
    }
  `);
});
