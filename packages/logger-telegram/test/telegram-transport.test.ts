import { afterEach, expect, test, vitest } from 'vitest';
import type { LogRecord } from '@aomex/logger';
import { TELEGRAM_MESSAGE_MAX_LENGTH, TelegramTransport } from '../src';
import { i18n } from '../src/i18n';

const TOKEN = '123456:ABC-DEF_secret-token';
const CHAT = -100123;

const baseLog = (
  partial: Partial<LogRecord> & Pick<LogRecord, 'level' | 'message'>,
): LogRecord => ({
  timestamp: new Date('2024-10-30T14:03:03.321Z'),
  ...partial,
});

const transport = () => new TelegramTransport({ botToken: TOKEN, chatId: CHAT });

const spySendMessage = (t: TelegramTransport) =>
  vitest.spyOn(t['api'], 'sendMessage').mockResolvedValue({
    message_id: 1,
  } as never);

afterEach(() => {
  vitest.useRealTimers();
  vitest.restoreAllMocks();
});

test('formatTelegramMessage 含 exception.stack', () => {
  const t = new TelegramTransport({ botToken: TOKEN, chatId: CHAT });
  const text = t['formatTelegramMessage'](
    baseLog({
      level: 'error',
      message: 'checkout failed',
      exception: {
        type: 'Error',
        message: 'boom',
        stack: 'Error: boom\n    at x',
      },
    }),
  );
  expect(text).toContain('[error]');
  expect(text).toContain('checkout failed');
  expect(text).toContain('Error: boom\n    at x');
});

test('formatTelegramMessage 无 stack 时输出 type: message', () => {
  const t = new TelegramTransport({ botToken: TOKEN, chatId: CHAT });
  const text = t['formatTelegramMessage'](
    baseLog({
      level: 'error',
      message: 'failed',
      exception: { type: 'TypeError', message: 'bad' },
    }),
  );
  expect(text).toContain('TypeError: bad');
});

test('formatTelegramMessage 含 bindings', () => {
  const t = new TelegramTransport({ botToken: TOKEN, chatId: CHAT });
  const text = t['formatTelegramMessage'](
    baseLog({
      level: 'info',
      message: 'ok',
      bindings: { requestId: 'r1' },
    }),
  );
  expect(text).toContain('{"requestId":"r1"}');
});

test('formatTelegramMessage 超长截断', () => {
  const t = new TelegramTransport({ botToken: TOKEN, chatId: CHAT });
  const text = t['formatTelegramMessage'](
    baseLog({
      level: 'error',
      message: 'x'.repeat(TELEGRAM_MESSAGE_MAX_LENGTH + 50),
    }),
  );
  expect(text.length).toBe(TELEGRAM_MESSAGE_MAX_LENGTH);
  expect(text.endsWith('…')).toBe(true);
});

test('构造时挂上 autoRetry，默认超时 120s，默认开启 dedupe 30s', () => {
  const t = new TelegramTransport({ botToken: TOKEN, chatId: CHAT });
  expect(t['api'].config.installedTransformers().length).toBeGreaterThanOrEqual(1);
  expect(t['timeout']).toBe(120_000);
  expect(t['dedupe']).toMatchObject({ interval: 30_000 });
});

test('通过 api.sendMessage 发送', async () => {
  const t = new TelegramTransport({
    botToken: TOKEN,
    chatId: CHAT,
    dedupe: false,
  });
  const spy = spySendMessage(t);
  await t.consume(baseLog({ level: 'error', message: 'hello' }));

  expect(spy).toHaveBeenCalledOnce();
  expect(spy).toHaveBeenCalledWith(
    CHAT,
    expect.stringContaining('hello'),
    { link_preview_options: { is_disabled: true } },
    expect.any(AbortSignal),
  );
});

test('自定义 format', async () => {
  const t = new TelegramTransport({
    botToken: TOKEN,
    chatId: '42',
    dedupe: false,
    format: (log) => `custom:${log.message}`,
  });
  const spy = spySendMessage(t);
  await t.consume(baseLog({ level: 'warn', message: 'ping' }));
  expect(spy).toHaveBeenCalledWith(
    '42',
    'custom:ping',
    expect.anything(),
    expect.any(AbortSignal),
  );
});

test('api 抛错原样抛出', async () => {
  const t = new TelegramTransport({
    botToken: TOKEN,
    chatId: CHAT,
    dedupe: false,
  });
  const boom = new Error(`Unauthorized for bot ${TOKEN}`);
  vitest.spyOn(t['api'], 'sendMessage').mockRejectedValueOnce(boom);
  await expect(t.consume(baseLog({ level: 'error', message: 'x' }))).rejects.toBe(boom);
});

test('超时 AbortError', async () => {
  const t = new TelegramTransport({
    botToken: TOKEN,
    chatId: CHAT,
    dedupe: false,
    timeout: 20,
  });
  vitest.spyOn(t['api'], 'sendMessage').mockImplementationOnce(async (...args) => {
    const signal = args[3] as AbortSignal | undefined;
    await new Promise<void>((_, reject) => {
      signal?.addEventListener('abort', () => {
        const err = new Error('aborted');
        err.name = 'AbortError';
        reject(err);
      });
    });
    return { message_id: 1 } as never;
  });
  await expect(t.consume(baseLog({ level: 'error', message: 'x' }))).rejects.toThrow(
    i18n.t('send_message_timed_out'),
  );
});

test('flush 等待 in-flight', async () => {
  let release!: () => void;
  const gate = new Promise<void>((r) => {
    release = r;
  });
  const t = new TelegramTransport({
    botToken: TOKEN,
    chatId: CHAT,
    dedupe: false,
  });
  vitest.spyOn(t['api'], 'sendMessage').mockImplementationOnce(async () => {
    await gate;
    return { message_id: 1 } as never;
  });
  const consuming = t.consume(baseLog({ level: 'error', message: 'x' }));
  const flushing = t.flush();
  release();
  await expect(consuming).resolves.toBeUndefined();
  await expect(flushing).resolves.toBeUndefined();
});

test('fingerprintLog 默认不含 bindings', () => {
  const t = transport();
  const a = t['fingerprintLog'](
    baseLog({
      level: 'error',
      message: 'same',
      bindings: { rid: 'r1', route: '/a' },
    }),
  );
  const b = t['fingerprintLog'](
    baseLog({
      level: 'error',
      message: 'same',
      bindings: { rid: 'r2', route: '/b' },
    }),
  );
  expect(a).toBe(b);
});

test('fingerprintLog bindingKeys 白名单', () => {
  const t = transport();
  const a = t['fingerprintLog'](
    baseLog({
      level: 'error',
      message: 'same',
      bindings: { userId: 1, rid: 'r1' },
    }),
    ['userId'],
  );
  const b = t['fingerprintLog'](
    baseLog({
      level: 'error',
      message: 'same',
      bindings: { userId: 1, rid: 'r2' },
    }),
    ['userId'],
  );
  const c = t['fingerprintLog'](
    baseLog({
      level: 'error',
      message: 'same',
      bindings: { userId: 2, rid: 'r1' },
    }),
    ['userId'],
  );
  expect(a).toBe(b);
  expect(a).not.toBe(c);
});

test('fingerprintLog bindingKeys all', () => {
  const t = transport();
  const a = t['fingerprintLog'](
    baseLog({
      level: 'error',
      message: 'same',
      bindings: { a: 1, b: 2 },
    }),
    'all',
  );
  const b = t['fingerprintLog'](
    baseLog({
      level: 'error',
      message: 'same',
      bindings: { b: 2, a: 1 },
    }),
    'all',
  );
  const c = t['fingerprintLog'](
    baseLog({
      level: 'error',
      message: 'same',
      bindings: { a: 1, b: 3 },
    }),
    'all',
  );
  expect(a).toBe(b);
  expect(a).not.toBe(c);
});

test('fingerprintLog 含 exception', () => {
  const t = transport();
  const withEx = t['fingerprintLog'](
    baseLog({
      level: 'error',
      message: 'x',
      exception: { type: 'Error', message: 'boom' },
    }),
  );
  const without = t['fingerprintLog'](baseLog({ level: 'error', message: 'x' }));
  expect(withEx).not.toBe(without);
});

test('dedupe 窗口内相同指纹合并为一条并带 ×N', async () => {
  vitest.useFakeTimers();
  const t = new TelegramTransport({
    botToken: TOKEN,
    chatId: CHAT,
    dedupe: { interval: 5_000 },
  });
  const spy = spySendMessage(t);

  await t.consume(
    baseLog({
      level: 'error',
      message: 'boom',
      bindings: { rid: 'r1' },
    }),
  );
  await t.consume(
    baseLog({
      level: 'error',
      message: 'boom',
      bindings: { rid: 'r2' },
    }),
  );
  expect(spy).not.toHaveBeenCalled();

  await vitest.advanceTimersByTimeAsync(5_000);
  expect(spy).toHaveBeenCalledOnce();
  expect(String(spy.mock.calls[0]![1])).toContain('(×2)');
  expect(String(spy.mock.calls[0]![1])).toContain('boom');
});

test('默认开启 dedupe，间隔 30s', async () => {
  vitest.useFakeTimers();
  const t = new TelegramTransport({
    botToken: TOKEN,
    chatId: CHAT,
  });
  const spy = spySendMessage(t);
  await t.consume(baseLog({ level: 'error', message: 'a' }));
  await vitest.advanceTimersByTimeAsync(29_999);
  expect(spy).not.toHaveBeenCalled();
  await vitest.advanceTimersByTimeAsync(1);
  expect(spy).toHaveBeenCalledOnce();
});

test('dedupe: false 立即发送', async () => {
  const t = new TelegramTransport({
    botToken: TOKEN,
    chatId: CHAT,
    dedupe: false,
  });
  const spy = spySendMessage(t);
  await t.consume(baseLog({ level: 'error', message: 'a' }));
  expect(spy).toHaveBeenCalledOnce();
});

test('dedupe 不同指纹各自发送', async () => {
  vitest.useFakeTimers();
  const t = new TelegramTransport({
    botToken: TOKEN,
    chatId: CHAT,
    dedupe: { interval: 1_000 },
  });
  const spy = spySendMessage(t);
  await t.consume(baseLog({ level: 'error', message: 'a' }));
  await t.consume(baseLog({ level: 'error', message: 'b' }));
  await vitest.advanceTimersByTimeAsync(1_000);
  expect(spy).toHaveBeenCalledTimes(2);
});

test('dedupe flush 提前刷出缓冲', async () => {
  vitest.useFakeTimers();
  const t = new TelegramTransport({
    botToken: TOKEN,
    chatId: CHAT,
    dedupe: { interval: 60_000 },
  });
  const spy = spySendMessage(t);
  await t.consume(baseLog({ level: 'error', message: 'early' }));
  await t.flush();
  expect(spy).toHaveBeenCalledOnce();
  expect(String(spy.mock.calls[0]![1])).toContain('early');
  expect(String(spy.mock.calls[0]![1])).not.toContain('(×');
});

test('dedupe 自定义 fingerprint', async () => {
  vitest.useFakeTimers();
  const t = new TelegramTransport({
    botToken: TOKEN,
    chatId: CHAT,
    dedupe: {
      interval: 1_000,
      fingerprint: () => 'fixed',
    },
  });
  const spy = spySendMessage(t);
  await t.consume(baseLog({ level: 'error', message: 'a' }));
  await t.consume(baseLog({ level: 'warn', message: 'b' }));
  await vitest.advanceTimersByTimeAsync(1_000);
  expect(spy).toHaveBeenCalledOnce();
  expect(String(spy.mock.calls[0]![1])).toContain('(×2)');
});

test('dedupe 定时刷出失败时 console.error', async () => {
  vitest.useFakeTimers();
  const reported = vitest.spyOn(console, 'error').mockImplementation(() => {});
  const t = new TelegramTransport({
    botToken: TOKEN,
    chatId: CHAT,
    dedupe: { interval: 100 },
  });
  vitest.spyOn(t['api'], 'sendMessage').mockRejectedValue(new Error('down'));
  await t.consume(baseLog({ level: 'error', message: 'x' }));
  await vitest.advanceTimersByTimeAsync(100);
  expect(reported).toHaveBeenCalled();
  expect(String(reported.mock.calls[0]![0])).toMatch(/dedupe flush failed/);
});
