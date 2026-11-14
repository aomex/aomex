import { expect, test } from 'vitest';
import { FileTransport } from '../../src/transports/file-transport';
import { i18n } from '../../src/i18n';
import { join } from 'path';
import { tmpdir } from 'os';
import { readFileSync, rmSync } from 'fs';
import { styleText } from 'util';

test('默认按日分目录、按等级切文件', () => {
  const t = new FileTransport();
  expect(
    t['resolveFilePath']({
      message: 'x',
      timestamp: new Date(1730296983321),
      level: 'info',
    }),
  ).toBe('logs/2024-10-30/info.log');
});

test('路径占位符支持 level', () => {
  const t = new FileTransport({
    file: './out/{year}/{level}-{hour}.log',
  });
  expect(
    t['resolveFilePath']({
      message: 'x',
      timestamp: new Date(1730296983321),
      level: 'warn',
    }),
  ).toBe('out/2024/warn-22.log');
});

test('输出到文件', async () => {
  const file = join(tmpdir(), 'logs/tmp.log');
  try {
    rmSync(file);
  } catch {}
  const t = new FileTransport({ file });
  await t.consume({
    message: 'hello world',
    timestamp: new Date(1730296983321),
    level: 'info',
  });
  expect(readFileSync(file, 'utf8')).toMatchInlineSnapshot(`
    "[info] 2024-10-30 22:03:03 hello world
    "
  `);
  await t.consume({
    message: 'hi earth',
    timestamp: new Date(1730296983321),
    level: 'warn',
  });
  expect(readFileSync(file, 'utf8')).toMatchInlineSnapshot(`
    "[info] 2024-10-30 22:03:03 hello world
    [warn] 2024-10-30 22:03:03 hi earth
    "
  `);
});

test('json 格式', async () => {
  const file = join(tmpdir(), 'logs/tmp-json.log');
  try {
    rmSync(file);
  } catch {}
  const t = new FileTransport({ file, format: 'json' });
  await t.consume({
    message: 'hello',
    timestamp: new Date(1730296983321),
    level: 'info',
  });
  expect(readFileSync(file, 'utf8')).toBe(
    `${JSON.stringify({
      time: new Date(1730296983321).toISOString(),
      level: 'info',
      message: 'hello',
    })}\n`,
  );
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
    message: 'hello world',
    timestamp: new Date(1730296983321),
    level: 'info',
  });
  expect(readFileSync(file1, 'utf8')).toMatchInlineSnapshot(`
    "[info] 2024-10-30 22:03:03 hello world
    "
  `);
  await t.consume({
    message: 'hello world',
    timestamp: new Date(1730296983321),
    level: 'warn',
  });
  expect(readFileSync(file1, 'utf8')).toMatchInlineSnapshot(`
    "[info] 2024-10-30 22:03:03 hello world
    [warn] 2024-10-30 22:03:03 hello world
    "
  `);
  await t.consume({
    message: 'hello world',
    timestamp: new Date(1740296983321),
    level: 'warn',
  });
  expect(readFileSync(file1, 'utf8')).toMatchInlineSnapshot(`
    "[info] 2024-10-30 22:03:03 hello world
    [warn] 2024-10-30 22:03:03 hello world
    "
  `);
  expect(readFileSync(file2, 'utf8')).toMatchInlineSnapshot(`
    "[warn] 2025-02-23 15:49:43 hello world
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
    message: 'hello world',
    timestamp: new Date(1730296983321),
    level: 'info',
  });
  expect(readFileSync(file, 'utf8')).toMatchInlineSnapshot(`
    "[info] 2024-10-30 22:03:03 hello world
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
    message: 'hello ' + styleText('green', 'world'),
    timestamp: new Date(1730296983321),
    level: 'info',
  });
  expect(readFileSync(file, 'utf8')).toMatchInlineSnapshot(`
    "[info] 2024-10-30 22:03:03 hello world
    "
  `);
});

test('text 含 exception 时写入 stack', async () => {
  const file = join(tmpdir(), 'logs/err-stack.log');
  try {
    rmSync(file);
  } catch {}
  const t = new FileTransport({ file });
  const stack = 'Error: boom\n    at foo';
  await t.consume({
    message: 'failed',
    timestamp: new Date(1730296983321),
    level: 'error',
    exception: { type: 'Error', message: 'boom', stack },
  });
  expect(readFileSync(file, 'utf8')).toBe(
    `[error] 2024-10-30 22:03:03 failed\n${stack}\n`,
  );
});

test('json 含 exception 字段', async () => {
  const file = join(tmpdir(), 'logs/err-json.log');
  try {
    rmSync(file);
  } catch {}
  const t = new FileTransport({ file, format: 'json' });
  const exception = { type: 'Error', message: 'boom', stack: 'Error: boom' };
  await t.consume({
    message: 'failed',
    timestamp: new Date(1730296983321),
    level: 'error',
    exception,
  });
  expect(readFileSync(file, 'utf8')).toBe(
    `${JSON.stringify({
      time: new Date(1730296983321).toISOString(),
      level: 'error',
      message: 'failed',
      exception,
    })}\n`,
  );
});

test('拒绝空字节路径', async () => {
  const t = new FileTransport({ file: 'foo\0bar.log' });
  await expect(
    t.consume({
      message: 'x',
      timestamp: new Date(),
      level: 'info',
    }),
  ).rejects.toThrow(i18n.t('invalid_log_file_path'));
});
