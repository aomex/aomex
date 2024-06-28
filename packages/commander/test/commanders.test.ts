import { expect, test, vitest } from 'vitest';
import { Commander, commanders } from '../src';
import { ConsoleApp, ConsoleMiddleware, collectConsoleDocument } from '@aomex/console';
import { join } from 'node:path';
import { middleware } from '@aomex/core';

const dir = import.meta.dirname;

test('中间件', async () => {
  expect(commanders([])).toBeInstanceOf(ConsoleMiddleware);
});

test('从路径动态加载', async () => {
  const app = new ConsoleApp({
    mount: [commanders(join(dir, 'fixture'))],
  });
  await expect(app.run('aaa1')).resolves.toBe(0);
  await expect(app.run('bbb1')).resolves.toBe(0);
});

test('直接传入指令', async () => {
  const spy = vitest.spyOn(console, 'log');
  const commander = new Commander({ prefix: 'schedule:' });
  commander.create('a', {
    action: () => {
      console.log('foo');
    },
  });
  commander.create('b', {
    action: () => {
      console.log('bar');
    },
  });
  const app = new ConsoleApp({
    mount: [commanders([commander])],
  });
  await expect(app.run('schedule:a')).resolves.toBe(0);
  expect(spy).toHaveBeenCalledWith('foo');
  spy.mockReset();
  await expect(app.run('schedule:b')).resolves.toBe(0);
  expect(spy).toHaveBeenCalledWith('bar');
  spy.mockRestore();
});

test('缓存指令实例', async () => {
  const commander = new Commander();
  commander.create('a', {
    action: () => {},
  });
  commander.create('b', {
    action: () => {},
  });
  const app = new ConsoleApp({
    mount: [commanders([commander])],
  });

  // @ts-expect-error
  const spy = vitest.spyOn(commander, 'toMiddleware');

  await Promise.all([
    app.run('a'),
    app.run('b'),
    app.run('a'),
    app.run('a'),
    app.run('b'),
  ]);

  expect(spy).toHaveBeenCalledTimes(1);
  spy.mockRestore();
});

test('未匹配上指令时继续其他中间件', async () => {
  const spy = vitest.fn();
  const app = new ConsoleApp({
    mount: [commanders(join(dir, 'fixture')), middleware.console(spy)],
  });
  await app.run('aaa1');
  expect(spy).toHaveBeenCalledTimes(0);
  await app.run('not-match');
  expect(spy).toHaveBeenCalledOnce();
});

test('文档', async () => {
  const commander = new Commander();
  commander.create('schedule1', {
    action: () => {},
  });
  commander.create('schedule2', {
    docs: {
      show: false,
    },
    action: () => {},
  });
  const doc = {};
  await collectConsoleDocument({
    document: doc,
    middlewareList: [commanders([commander])],
    app: new ConsoleApp(),
  });
  expect(doc).toMatchInlineSnapshot(`
    {
      "schedule1": {
        "show": true,
      },
      "schedule2": {
        "show": false,
      },
    }
  `);
});
