import { expect, test, vitest } from 'vitest';
import { ConsoleTransport } from '../../src/transports/console-transport';
import { styleText } from 'util';

test('标准输出', async () => {
  const t = new ConsoleTransport({ colorize: false });
  const spy = vitest.spyOn(process.stdout, 'write').mockImplementation(() => true);
  await t.consume({
    message: 'hello world',
    timestamp: new Date(1730296983321),
    level: 'info',
  });
  expect(spy).toHaveBeenCalledTimes(1);
  expect(spy).toHaveBeenCalledWith('[info] 2024-10-30 22:03:03 hello world\n');
  spy.mockRestore();
});

test('固定 output 走同一流', async () => {
  const t = new ConsoleTransport({ output: process.stderr, colorize: false });
  const spy = vitest.spyOn(process.stderr, 'write').mockImplementation(() => true);
  await t.consume({
    message: 'hello world',
    timestamp: new Date(1730296983321),
    level: 'info',
  });
  expect(spy).toHaveBeenCalledTimes(1);
  expect(spy).toHaveBeenLastCalledWith('[info] 2024-10-30 22:03:03 hello world\n');
  spy.mockRestore();
});

test('error/fatal 默认走 stderr', async () => {
  const t = new ConsoleTransport({ colorize: false });
  const out = vitest.spyOn(process.stdout, 'write').mockImplementation(() => true);
  const err = vitest.spyOn(process.stderr, 'write').mockImplementation(() => true);

  await t.consume({
    message: 'ok',
    timestamp: new Date(1730296983321),
    level: 'info',
  });
  await t.consume({
    message: 'boom',
    timestamp: new Date(1730296983321),
    level: 'error',
  });

  expect(out).toHaveBeenCalledWith('[info] 2024-10-30 22:03:03 ok\n');
  expect(err).toHaveBeenCalledWith('[error] 2024-10-30 22:03:03 boom\n');
  out.mockRestore();
  err.mockRestore();
});

test('json 格式', async () => {
  const t = new ConsoleTransport({ format: 'json', colorize: false });
  const spy = vitest.spyOn(process.stdout, 'write').mockImplementation(() => true);
  await t.consume({
    message: 'hello',
    timestamp: new Date(1730296983321),
    level: 'info',
  });
  expect(spy).toHaveBeenCalledWith(
    `${JSON.stringify({
      time: new Date(1730296983321).toISOString(),
      level: 'info',
      message: 'hello',
    })}\n`,
  );
  spy.mockRestore();
});

test('颜色', async () => {
  const t = new ConsoleTransport({
    colorize: true,
    colors: { info: 'green', warn: 'red' },
    stderrLevels: [],
  });
  const spy = vitest.spyOn(process.stdout, 'write').mockImplementation(() => true);
  await t.consume({
    message: 'hello world',
    timestamp: new Date(1730296983321),
    level: 'info',
  });
  expect(spy).toHaveBeenLastCalledWith(
    `${styleText('green', '[info]')} ${styleText('green', '2024-10-30 22:03:03')} hello world\n`,
  );

  await t.consume({
    message: 'hello world',
    timestamp: new Date(1730296983321),
    level: 'warn',
  });
  expect(spy).toHaveBeenLastCalledWith(
    `${styleText('red', '[warn]')} ${styleText('red', '2024-10-30 22:03:03')} hello world\n`,
  );
  spy.mockRestore();
});

test('text 有 exception.stack 时追加栈', async () => {
  const t = new ConsoleTransport({ colorize: false });
  const spy = vitest.spyOn(process.stderr, 'write').mockImplementation(() => true);
  const stack = 'Error: boom\n    at foo';
  await t.consume({
    message: 'checkout failed',
    timestamp: new Date(1730296983321),
    level: 'error',
    exception: { type: 'Error', message: 'boom', stack },
  });
  expect(spy).toHaveBeenCalledWith(
    `[error] 2024-10-30 22:03:03 checkout failed\n${stack}\n`,
  );
  spy.mockRestore();
});

test('json 含 exception 字段', async () => {
  const t = new ConsoleTransport({ format: 'json', colorize: false });
  const spy = vitest.spyOn(process.stderr, 'write').mockImplementation(() => true);
  const exception = {
    type: 'Error',
    message: 'boom',
    stack: 'Error: boom',
  };
  await t.consume({
    message: 'checkout failed',
    timestamp: new Date(1730296983321),
    level: 'error',
    exception,
  });
  expect(spy).toHaveBeenCalledWith(
    `${JSON.stringify({
      time: new Date(1730296983321).toISOString(),
      level: 'error',
      message: 'checkout failed',
      exception,
    })}\n`,
  );
  spy.mockRestore();
});

test('text 无 stack 时输出 type: message', async () => {
  const t = new ConsoleTransport({ colorize: false });
  const spy = vitest.spyOn(process.stderr, 'write').mockImplementation(() => true);
  await t.consume({
    message: 'failed',
    timestamp: new Date(1730296983321),
    level: 'error',
    exception: { type: 'TypeError', message: 'bad' },
  });
  expect(spy).toHaveBeenCalledWith(
    '[error] 2024-10-30 22:03:03 failed\nTypeError: bad\n',
  );
  spy.mockRestore();
});

test('着色时仍追加 exception.stack', async () => {
  const t = new ConsoleTransport({
    colorize: true,
    colors: { error: 'red' },
    stderrLevels: [],
  });
  const spy = vitest.spyOn(process.stdout, 'write').mockImplementation(() => true);
  const stack = 'Error: boom\n    at foo';
  await t.consume({
    message: 'failed',
    timestamp: new Date(1730296983321),
    level: 'error',
    exception: { type: 'Error', message: 'boom', stack },
  });
  expect(spy).toHaveBeenLastCalledWith(
    `${styleText('red', '[error]')} ${styleText('red', '2024-10-30 22:03:03')} failed\n${stack}\n`,
  );
  spy.mockRestore();
});

test('着色且无 stack 时追加 type: message', async () => {
  const t = new ConsoleTransport({
    colorize: true,
    colors: { error: 'red' },
    stderrLevels: [],
  });
  const spy = vitest.spyOn(process.stdout, 'write').mockImplementation(() => true);
  await t.consume({
    message: 'failed',
    timestamp: new Date(1730296983321),
    level: 'error',
    exception: { type: 'TypeError', message: 'bad' },
  });
  expect(spy).toHaveBeenLastCalledWith(
    `${styleText('red', '[error]')} ${styleText('red', '2024-10-30 22:03:03')} failed\nTypeError: bad\n`,
  );
  spy.mockRestore();
});
