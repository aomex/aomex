import { expect, test, vitest } from 'vitest';
import { ConsoleTransport } from '../../src/transports/console-transport';
import { styleText } from 'util';

test('标准输出', async () => {
  const t = new ConsoleTransport();
  const spy = vitest.spyOn(process.stdout, 'write').mockImplementation(() => true);
  await t.consume({
    text: 'hello world',
    timestamp: new Date(1730296983321),
    level: 'foo',
  });
  expect(spy).toBeCalledTimes(1);
  expect(spy).toBeCalledWith('[foo] 2024-10-30 22:03:03 hello world\n');
  spy.mockRestore();
});

test('标准错误', async () => {
  const t = new ConsoleTransport({ output: process.stderr });
  const spy = vitest.spyOn(process.stderr, 'write').mockImplementation(() => true);
  await t.consume({
    text: 'hello world',
    timestamp: new Date(1730296983321),
    level: 'foo',
  });
  expect(spy).toBeCalledTimes(1);
  expect(spy).toHaveBeenLastCalledWith('[foo] 2024-10-30 22:03:03 hello world\n');
  spy.mockRestore();
});

test('颜色', async () => {
  const t = new ConsoleTransport({
    colors: { foo: 'green', bar: 'red' },
  });
  const spy = vitest.spyOn(process.stdout, 'write').mockImplementation(() => true);
  await t.consume({
    text: 'hello world',
    timestamp: new Date(1730296983321),
    level: 'foo',
  });
  expect(spy).toHaveBeenLastCalledWith(
    `${styleText('green', '[foo]')} ${styleText('green', '2024-10-30 22:03:03')} hello world\n`,
  );

  await t.consume({
    text: 'hello world',
    timestamp: new Date(1730296983321),
    level: 'bar',
  });
  expect(spy).toHaveBeenLastCalledWith(
    `${styleText('red', '[bar]')} ${styleText('red', '2024-10-30 22:03:03')} hello world\n`,
  );
  spy.mockRestore();
});
