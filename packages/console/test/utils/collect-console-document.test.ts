import { MixinMiddleware, middleware } from '@aomex/common';
import { expect, test, vitest } from 'vitest';
import { ConsoleApp, collectConsoleDocument } from '../../src';
import sleep from 'sleep-promise';

const app = new ConsoleApp();

test('返回异步结果', () => {
  expect(
    collectConsoleDocument({ document: {}, middlewareList: [], app }),
  ).toBeInstanceOf(Promise);
});

test('按洋葱顺序收集', async () => {
  let str = '';
  const md1 = middleware.console({
    fn: () => {},
    help: {
      async onDocument() {
        str += '-a1';
      },
      async postDocument() {
        str += 'd3';
      },
    },
  });
  const md2 = middleware.console({
    fn: () => {},
    help: {
      async onDocument() {
        str += 'a2';
      },
      async postDocument() {
        str += 'd2';
      },
    },
  });
  const md3 = middleware.console({
    fn: () => {},
    help: {
      async onDocument() {
        str += 'a3';
      },
      async postDocument() {
        str += '-d1';
      },
    },
  });
  await collectConsoleDocument({
    document: {
      foo: {},
    },
    middlewareList: [md1, md2, md3],
    app,
  });
  expect(str).toBe('-a1a2a3-d1d2d3');
});

test('xxCommandItem()使用勾子触发', async () => {
  let str = '';
  const md1 = middleware.console({
    fn: () => {},
    help: {
      onDocument() {
        str += '-a1';
      },
      postDocument() {
        str += 'd3';
      },
      onCommandItem() {
        str += '-b1';
      },
      postCommandItem() {
        str += 'c3';
      },
    },
  });
  const md2 = middleware.console({
    fn: () => {},
    help: {
      onDocument() {
        str += 'a2';
      },
      postDocument() {
        str += 'd2';
      },
      onCommandItem() {
        str += 'b2';
      },
      postCommandItem() {
        str += 'c2';
      },
    },
  });
  const md3 = middleware.console({
    fn: () => {},
    help: {
      onDocument(doc, { collectCommand: setCommandHook }) {
        doc['foo'] = {};
        setCommandHook('foo', [md1, md2, md3]);
        str += 'a3';
      },
      postDocument() {
        str += '-d1';
      },
      onCommandItem() {
        str += 'b3';
      },
      postCommandItem() {
        str += '-c1';
      },
    },
  });
  await collectConsoleDocument({ document: {}, middlewareList: [md1, md2], app });
  expect(str).toBe('-a1a2d2d3');
  str = '';
  await collectConsoleDocument({ document: {}, middlewareList: [md1, md2, md3], app });
  expect(str).toBe('-a1a2a3-b1b2b3-c1c2c3-d1d2d3');
});

test('xxCommandItem需要指令先被收集', async () => {
  let str = '';
  const md1 = middleware.console({
    fn: () => {},
    help: {
      onDocument(doc, { collectCommand: setCommandHook }) {
        doc['bar'] = {};
        setCommandHook('foo', [md1]);
        str += '-a1';
      },
      postDocument() {
        str += '-d1';
      },
      onCommandItem() {
        str += '-b1';
      },
      postCommandItem() {
        str += '-c1';
      },
    },
  });

  await collectConsoleDocument({ document: {}, middlewareList: [md1], app });
  expect(str).toBe('-a1-d1');
});

test('同个收集勾子是并发进行的', async () => {
  let str = '';
  const md1 = middleware.console({
    fn: () => {},
    help: {
      async onDocument() {
        await sleep(10);
        str += '3';
      },
    },
  });
  const md2 = middleware.console({
    fn: () => {},
    help: {
      async onDocument() {
        str += '1';
      },
    },
  });
  const md3 = middleware.console({
    fn: () => {},
    help: {
      async onDocument() {
        str += '2';
      },
    },
  });

  await collectConsoleDocument({
    document: {},
    middlewareList: [md1, md2, md3],
    app,
  });
  expect(str).toBe('123');
});

test('混合中间件不提供help方法', async () => {
  const md1 = middleware.console({
    fn: () => {},
    help: {},
  });
  class M2 extends MixinMiddleware {
    help() {
      return {};
    }
  }
  const md2 = new M2(() => {});
  const spy = vitest.spyOn(md2, 'help');
  await collectConsoleDocument({ document: {}, middlewareList: [md1, md2], app });
  expect(spy).toHaveBeenCalledTimes(0);
});
