import { TestConsoleApp } from '../../src/testing';
import { afterAll, expect, test, vitest } from 'vitest';
import { ConsoleApp, ConsoleMiddleware } from '../../src';
import { afterEach } from 'node:test';
import { combineServices, middleware } from '@aomex/common';
import { BaseLoggerService } from '@aomex/logger';
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
  const app = new TestConsoleApp({});
  await app.run();
  expect(lastMsg).toMatchInlineSnapshot(`
    "aomex [命令] [选项]

    选项：
      -v, --version  显示 aomex 的版本号                                      [布尔]
      -h, --help     显示帮助信息                                             [布尔]"
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
  const app = new TestConsoleApp({
    mount: [md],
  });
  await app.run('-h');
  expect(stripVTControlCharacters(lastMsg)).toMatchInlineSnapshot(`
    "aomex [命令] [选项]

    命令：
      aomex foo  im foo
      aomex bar  im bar

    选项：
      -v, --version  显示 aomex 的版本号                                      [布尔]
      -h, --help     显示帮助信息                                             [布尔]"
  `);
});

test('输出版本号', async () => {
  const app = new TestConsoleApp({});
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
  const app = new TestConsoleApp({
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
  const app = new TestConsoleApp({
    mount: [md],
  });
  await app.run('-h');
  expect(stripVTControlCharacters(lastMsg)).toMatchInlineSnapshot(`
    "aomex [命令] [选项]

    命令：
      aomex foo  foooooo

    选项：
      -v, --version  显示 aomex 的版本号                                      [布尔]
      -h, --help     显示帮助信息                                             [布尔]"
  `);

  app.removeAllListeners('error');
  app.on('error', (err) => {
    lastMsg = err.message;
  });
  await app.run('bar', '-h');
  expect(stripVTControlCharacters(lastMsg)).toMatch('找不到命令「bar」的用法');
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
  const app = new TestConsoleApp({
    mount: [md],
  });
  await app.run('foo', '-h');
  expect(stripVTControlCharacters(lastMsg)).toMatchInlineSnapshot(`
    "aomex foo [选项]

    im foo

    选项：
          --keya        传入一个键，有用                                    [字符串]
      -b, --keyb, --bb                                                        [数字]
          --keyc                           [deprecated] [布尔] [默认值: "xxxyyyzzz"]"
  `);
});

test('检测相似指令', async () => {
  class CaptureLogger extends BaseLoggerService {
    protected createTransports() {
      return [];
    }
    override error(messageOrError: unknown, message?: string): void {
      lastMsg = `Error: ${Error.isError(messageOrError) ? messageOrError.message : String(messageOrError)}`;
      if (message === undefined) super.error(messageOrError);
      else super.error(messageOrError, message);
    }
  }
  const services = await combineServices(
    { logger: async () => CaptureLogger },
    { eager: ['logger'] },
  );
  const app = new ConsoleApp({
    services,
    logger: services.logger,
    language: 'zh-CN',
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
  expect(lastMsg).toMatch('Error: 命令「fooo」不存在，你是说「aomex fool」吗？');
  await app.run('testme');
  expect(lastMsg).toMatch('Error: 命令「testme」不存在');
});

test('帮助里的 yargs 文案跟随规范语言码', async () => {
  const cases = [
    ['en-US', '[boolean]'],
    ['zh-TW', '[布林]'],
    ['zh-HK', '[布林]'],
    ['ja-JP', '[真偽]'],
    ['be-BY', '[булевы тып]'],
    ['hy-AM', '[boolean]'],
  ] as const;
  for (const [language, marker] of cases) {
    const app = new TestConsoleApp({ language });
    await app.run('-h');
    expect(lastMsg, language).toContain(marker);
  }
  const restore = new TestConsoleApp({ language: 'zh-CN' });
  await restore.run('-h');
  expect(lastMsg).toContain('[布尔]');
});
