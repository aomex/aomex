import { expect, test } from 'vitest';
import { PassThrough } from 'node:stream';
import { StreamTransport } from '../../src/transports/stream-transport';

test('写入 writable 文本', async () => {
  const stream = new PassThrough();
  const chunks: string[] = [];
  stream.on('data', (c) => chunks.push(String(c)));

  const t = new StreamTransport({ stream });
  await t.consume({
    message: 'hello',
    timestamp: new Date(1730296983321),
    level: 'info',
  });

  expect(chunks.join('')).toBe('[info] 2024-10-30 22:03:03 hello\n');
});

test('写入 writable json', async () => {
  const stream = new PassThrough();
  const chunks: string[] = [];
  stream.on('data', (c) => chunks.push(String(c)));

  const t = new StreamTransport({ stream, format: 'json' });
  await t.consume({
    message: 'hello',
    timestamp: new Date(1730296983321),
    level: 'warn',
  });

  expect(chunks.join('')).toBe(
    `${JSON.stringify({
      time: new Date(1730296983321).toISOString(),
      level: 'warn',
      message: 'hello',
    })}\n`,
  );
});

test('write 失败时 reject', async () => {
  const stream = new PassThrough();
  stream.write = ((_chunk: any, encodingOrCb?: any, cb?: any) => {
    const done = typeof encodingOrCb === 'function' ? encodingOrCb : cb;
    done?.(new Error('disk full'));
    return false;
  }) as typeof stream.write;

  const t = new StreamTransport({ stream });
  await expect(
    t.consume({
      message: 'x',
      timestamp: new Date(),
      level: 'info',
    }),
  ).rejects.toThrow(/disk full/);
});

test('json 含 exception', async () => {
  const stream = new PassThrough();
  const chunks: string[] = [];
  stream.on('data', (c) => chunks.push(String(c)));
  const t = new StreamTransport({ stream, format: 'json' });
  const exception = { type: 'Error', message: 'boom' };
  await t.consume({
    message: 'failed',
    timestamp: new Date(1730296983321),
    level: 'error',
    exception,
  });
  expect(chunks.join('')).toBe(
    `${JSON.stringify({
      time: new Date(1730296983321).toISOString(),
      level: 'error',
      message: 'failed',
      exception,
    })}\n`,
  );
});
