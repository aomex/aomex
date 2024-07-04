import { afterAll, expect, test, vitest } from 'vitest';
import { ConsoleApp, ConsoleMiddleware } from '../../src';
import { afterEach } from 'node:test';
import { middleware } from '@aomex/core';
import { stripVTControlCharacters } from 'node:util';
import { helpLogger } from '../../src/middleware/help-logger';

let lastMsg = '';
const spyLog = vitest.spyOn(console, 'log').mockImplementation((data) => {
  lastMsg = data;
});
const spyError = vitest.spyOn(console, 'error').mockImplementation((data) => {
  lastMsg = data;
});

afterEach(() => {
  spyLog.mockClear();
  spyError.mockClear();
});

afterAll(() => {
  spyLog.mockRestore();
  spyError.mockRestore();
});

test('是中间件', () => {
  expect(helpLogger([])).toBeInstanceOf(ConsoleMiddleware);
});

test('未传入指令时输出全局消息', async () => {
  const app = new ConsoleApp();
  await app.run();
  expect(lastMsg).toMatchInlineSnapshot(`
    "aomex [指令] [选项]

    选项：
      -v, --version  显示aomex版本号                                                 [布尔]
      -h, --help     显示帮助信息                                                     [布尔]"
  `);
});

test('自定义指令', async () => {
  const md = middleware.console({
    fn: (_, next) => next(),
    help: {
      onDocument(doc) {
        doc['foo'] = { summary: 'im foo' };
        doc['bar'] = { summary: 'im bar' };
      },
    },
  });
  const app = new ConsoleApp({
    mount: [md],
  });
  await app.run('-h');
  expect(stripVTControlCharacters(lastMsg)).toMatchInlineSnapshot(`
    "aomex [指令] [选项]

    命令：
      aomex foo  im foo
      aomex bar  im bar

    选项：
      -v, --version  显示aomex版本号                                                 [布尔]
      -h, --help     显示帮助信息                                                     [布尔]"
  `);
});

test('输出版本号', async () => {
  const app = new ConsoleApp();
  const spy = vitest.spyOn(console, 'log');
  await app.run('-v');
  expect(spy).toHaveBeenLastCalledWith('{{#version}}');
  await app.run('--version');
  expect(spy).toHaveBeenLastCalledWith('{{#version}}');
});

test('展示指令详情', async () => {
  const md = middleware.console({
    fn: (_, next) => next(),
    help: {
      onDocument(doc) {
        doc['foo'] = { description: 'im foo' };
      },
    },
  });
  const app = new ConsoleApp({
    mount: [md],
  });
  await app.run('foo', '-h');
  expect(stripVTControlCharacters(lastMsg)).toMatchInlineSnapshot(`
    "aomex foo [选项]

    im foo"
  `);
});

test('设置show=false禁止显示用法', async () => {
  const md = middleware.console({
    fn: (_, next) => next(),
    help: {
      onDocument(doc) {
        doc['foo'] = { summary: 'foooooo', description: 'im foo', showInHelp: true };
        doc['bar'] = {
          summary: 'barrrrrr',
          description: 'im bar',
          showInHelp: false,
        };
      },
    },
  });
  const app = new ConsoleApp({
    mount: [md],
  });
  await app.run('-h');
  expect(stripVTControlCharacters(lastMsg)).toMatchInlineSnapshot(`
    "aomex [指令] [选项]

    命令：
      aomex foo  foooooo

    选项：
      -v, --version  显示aomex版本号                                                 [布尔]
      -h, --help     显示帮助信息                                                     [布尔]"
  `);

  await app.run('bar', '-h');
  expect(stripVTControlCharacters(lastMsg)).toMatch('找不到关于指令 "bar" 的用法');
});

test('指令参数', async () => {
  const md = middleware.console({
    fn: (_, next) => next(),
    help: {
      onDocument(doc) {
        doc['foo'] = {
          summary: 'foooooo',
          description: 'im foo',
          showInHelp: true,
          parameters: [
            {
              name: 'keya',
              type: 'string',
              description: '传入一个键，有用',
            },
            {
              name: 'keyb',
              type: 'number',
              alias: ['b', 'bb'],
            },
            {
              name: 'keyc',
              type: 'boolean',
              deprecated: true,
              defaultValue: 'xxxyyyzzz',
            },
          ],
        };
      },
    },
  });
  const app = new ConsoleApp({
    mount: [md],
  });
  await app.run('foo', '-h');
  expect(stripVTControlCharacters(lastMsg)).toMatchInlineSnapshot(`
    "aomex foo [选项]

    im foo

    选项：
          --keya        传入一个键，有用                                               [字符串]
      -b, --keyb, --bb                                                          [数字]
          --keyc                                [deprecated] [布尔] [默认值: "xxxyyyzzz"]"
  `);
});

test('检测相似指令', async () => {
  const app = new ConsoleApp({
    mount: [
      middleware.console({
        fn: () => {},
        help: {
          onDocument(doc) {
            doc['bar'] = {};
            doc['fool'] = { summary: 'I am foolish' };
            doc['foo'] = {};
            doc['fools'] = { showInHelp: false };
          },
        },
      }),
    ],
  });

  await app.run('fooo');
  expect(lastMsg).toMatch('Error: 指令 "fooo" 不存在，你是说 "aomex fool" 吗？');
  await app.run('testme');
  expect(lastMsg).toMatch('Error: 指令 "testme" 不存在');
});
