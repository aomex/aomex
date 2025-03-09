import { expect, test } from 'vitest';
import { FileTransport } from '../../src/transports/file-transport';
import { join } from 'path';
import { tmpdir } from 'os';
import { readFileSync, rmSync } from 'fs';
import { styleText } from 'util';

test('输出到文件', async () => {
  const file = join(tmpdir(), 'logs/tmp.log');
  try {
    rmSync(file);
  } catch {}
  const t = new FileTransport({ file });
  await t.consume({
    text: 'hello world',
    timestamp: new Date(1730296983321),
    level: 'foo',
  });
  expect(readFileSync(file, 'utf8')).toMatchInlineSnapshot(`
    "
    [foo] 2024-10-30 22:03:03 hello world
    "
  `);
  await t.consume({ text: 'hi earth', timestamp: new Date(1730296983321), level: 'bar' });
  expect(readFileSync(file, 'utf8')).toMatchInlineSnapshot(`
    "
    [foo] 2024-10-30 22:03:03 hello world

    [bar] 2024-10-30 22:03:03 hi earth
    "
  `);
});

test('时间文件名', async () => {
  const file = join(tmpdir(), 'logs/tmp-{year}-{month}-{day}.log');
  const file1 = join(tmpdir(), 'logs/tmp-2024-10-30.log');
  const file2 = join(tmpdir(), 'logs/tmp-2025-02-23.log');
  try {
    rmSync(file1);
  } catch {}
  try {
    rmSync(file2);
  } catch {}
  const t = new FileTransport({ file });
  await t.consume({
    text: 'hello world',
    timestamp: new Date(1730296983321),
    level: 'foo',
  });
  expect(readFileSync(file1, 'utf8')).toMatchInlineSnapshot(`
    "
    [foo] 2024-10-30 22:03:03 hello world
    "
  `);
  await t.consume({
    text: 'hello world',
    timestamp: new Date(1730296983321),
    level: 'bar',
  });
  expect(readFileSync(file1, 'utf8')).toMatchInlineSnapshot(`
    "
    [foo] 2024-10-30 22:03:03 hello world

    [bar] 2024-10-30 22:03:03 hello world
    "
  `);
  await t.consume({
    text: 'hello world',
    timestamp: new Date(1740296983321),
    level: 'bar',
  });
  expect(readFileSync(file1, 'utf8')).toMatchInlineSnapshot(`
    "
    [foo] 2024-10-30 22:03:03 hello world

    [bar] 2024-10-30 22:03:03 hello world
    "
  `);
  expect(readFileSync(file2, 'utf8')).toMatchInlineSnapshot(`
    "
    [bar] 2025-02-23 15:49:43 hello world
    "
  `);
});

test('动态文件名', async () => {
  const file = join(tmpdir(), 'logs/dynamic.log');
  try {
    rmSync(file);
  } catch {}
  const t = new FileTransport({ file: () => file });
  await t.consume({
    text: 'hello world',
    timestamp: new Date(1730296983321),
    level: 'foo',
  });
  expect(readFileSync(file, 'utf8')).toMatchInlineSnapshot(`
    "
    [foo] 2024-10-30 22:03:03 hello world
    "
  `);
});

test('过滤掉样式字符', async () => {
  const file = join(tmpdir(), 'logs/strip-ansi.log');
  try {
    rmSync(file);
  } catch {}
  const t = new FileTransport({ file });
  await t.consume({
    text: 'hello ' + styleText('green', 'world'),
    timestamp: new Date(1730296983321),
    level: 'foo',
  });
  expect(readFileSync(file, 'utf8')).toMatchInlineSnapshot(`
    "
    [foo] 2024-10-30 22:03:03 hello world
    "
  `);
});
