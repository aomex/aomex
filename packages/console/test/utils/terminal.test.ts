import { describe, expect, test, vitest } from 'vitest';
import { terminal } from '../../src';
import { styleText } from 'util';
import { sleep } from '@aomex/internal-tools';

test('generateTable', () => {
  expect(
    terminal.generateTable([
      ['编号', '姓名', '性别'],
      [1, '张三', '男'],
      [2, '李四', '男'],
      [3, '翠花', '女'],
    ]),
  ).toMatchInlineSnapshot(`
    "╔══════╤══════╤══════╗
    ║ 编号 │ 姓名 │ 性别 ║
    ╟──────┼──────┼──────╢
    ║ 1    │ 张三 │ 男   ║
    ╟──────┼──────┼──────╢
    ║ 2    │ 李四 │ 男   ║
    ╟──────┼──────┼──────╢
    ║ 3    │ 翠花 │ 女   ║
    ╚══════╧══════╧══════╝
    "
  `);
});

test('printTable', () => {
  const spy = vitest.spyOn(console, 'log');
  terminal.printTable([
    ['编号', '姓名', '性别'],
    [1, '张三', '男'],
    [2, '李四', '男'],
    [3, '翠花', '女'],
  ]);
  expect(spy).toBeCalledWith(
    `╔══════╤══════╤══════╗
║ 编号 │ 姓名 │ 性别 ║
╟──────┼──────┼──────╢
║ 1    │ 张三 │ 男   ║
╟──────┼──────┼──────╢
║ 2    │ 李四 │ 男   ║
╟──────┼──────┼──────╢
║ 3    │ 翠花 │ 女   ║
╚══════╧══════╧══════╝
`,
  );
});

test('printWarning', () => {
  const spy = vitest.spyOn(console, 'warn');
  terminal.printWarning('放学别跑');
  expect(spy).toBeCalledTimes(1);
  spy.mockRestore();
});

test('print', () => {
  const spy = vitest.spyOn(console, 'log');
  terminal.print('放学别跑');
  expect(spy).toBeCalledTimes(1);
  spy.mockRestore();
});

test('printInfo', () => {
  const spy = vitest.spyOn(console, 'info');
  terminal.printInfo('放学别跑');
  expect(spy).toBeCalledTimes(1);
  spy.mockRestore();
});

test('printError', () => {
  const spy = vitest.spyOn(console, 'error');
  terminal.printError('放学别跑');
  expect(spy).toBeCalledTimes(1);
  spy.mockRestore();
});

test('printSuccess', () => {
  const spy = vitest.spyOn(console, 'log');
  terminal.printSuccess('放学跑了');
  expect(spy).toBeCalledTimes(1);
  spy.mockRestore();
});

test('stripStyle', () => {
  expect(terminal.stripStyle(styleText('red', '放学别跑'))).toBe('放学别跑');
});

describe('runTasks', () => {
  test('正常流程', async () => {
    const result = await terminal.runTasks<{ value: string }>([
      {
        title: 'a',
        async task(ctx, task) {
          await sleep(100);
          ctx.value += '-' + task.title;
        },
      },
      {
        title: 'b',
        async task(ctx, task) {
          ctx.value += task.title;
        },
      },
      {
        title: 'c',
        async task(ctx, task) {
          ctx.value += task.title;
        },
      },
    ]);

    expect(result).toMatchInlineSnapshot(`
      {
        "context": {
          "value": "undefined-abc",
        },
        "error": null,
      }
    `);
  });

  test('跳过', async () => {
    const result = await terminal.runTasks<{ value: string }>([
      {
        title: 'a',
        skip: () => false,
        async task(ctx, task) {
          await sleep(100);
          ctx.value += '-' + task.title;
        },
      },
      {
        title: 'b',
        skip: true,
        async task(ctx, task) {
          ctx.value += task.title;
        },
      },
      {
        title: 'c',
        skip: async () => false,
        async task(ctx, task) {
          ctx.value += task.title;
        },
      },
      {
        title: 'd',
        skip: async () => true,
        async task(ctx, task) {
          ctx.value += task.title;
        },
      },
    ]);

    expect(result).toMatchInlineSnapshot(`
      {
        "context": {
          "value": "undefined-ac",
        },
        "error": null,
      }
    `);
  });

  test('批量执行', async () => {
    const result = await terminal.runTasks<{ value: string }>(
      [
        {
          title: 'a',
          async task(ctx, task) {
            await sleep(1000);
            ctx.value += '-' + task.title;
          },
        },
        {
          title: 'b',
          async task(ctx, task) {
            await sleep(2000);
            ctx.value += '-' + task.title;
          },
        },
        {
          title: 'c',
          async task(ctx, task) {
            await sleep(400);
            ctx.value += '-' + task.title;
          },
        },
      ],
      {
        concurrent: true,
      },
    );

    expect(result).toMatchInlineSnapshot(`
      {
        "context": {
          "value": "undefined-c-a-b",
        },
        "error": null,
      }
    `);
  });

  test('按顺序执行报错', async () => {
    const result = await terminal.runTasks<{ value: string }>([
      {
        title: 'a',
        async task(ctx, task) {
          await sleep(100);
          ctx.value += '-' + task.title;
        },
      },
      {
        title: 'b',
        async task() {
          throw new Error('abc');
        },
      },
      {
        title: 'c',
        async task(ctx, task) {
          ctx.value += task.title;
        },
      },
    ]);

    expect(result).toMatchInlineSnapshot(`
      {
        "context": {
          "value": "undefined-a",
        },
        "error": [Error: abc],
      }
    `);
  });

  test('批量执行报错', async () => {
    const result = await terminal.runTasks<{ value: string }>(
      [
        {
          title: 'a',
          async task() {
            await sleep(1000);
            throw new Error('a_a');
          },
        },
        {
          title: 'b',
          async task() {
            await sleep(2000);
            throw new Error('b_b');
          },
        },
        {
          title: 'c',
          async task(ctx, task) {
            await sleep(400);
            ctx.value += '-' + task.title;
          },
        },
      ],
      {
        concurrent: true,
      },
    );

    expect(result).toMatchInlineSnapshot(`
      {
        "context": {
          "value": "undefined-c",
        },
        "errors": [
          [Error: a_a],
          [Error: b_b],
        ],
      }
    `);
  });

  test('修改状态', async () => {
    const result = await terminal.runTasks<{ value: string }>([
      {
        title: 'a',
        async task(ctx, task) {
          ctx.value += '-' + task.status;
          task.status = 'skip';
          ctx.value += '-' + task.status;
        },
      },
    ]);

    expect(result).toMatchInlineSnapshot(`
      {
        "context": {
          "value": "undefined-loading-skip",
        },
        "error": null,
      }
    `);
  });
});