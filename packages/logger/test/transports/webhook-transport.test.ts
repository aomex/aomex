import { afterEach, expect, test, vi } from 'vitest';
import { WebhookTransport } from '../../src/transports/webhook-transport';
import { i18n } from '../../src/i18n';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const sampleLog = {
  message: 'hello',
  timestamp: new Date(1730296983321),
  level: 'error' as const,
};

const stubFetch = (
  impl: (input: string | URL | Request, init?: RequestInit) => Promise<Response>,
) => {
  const fetchMock = vi.fn(impl);
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
};

test('默认 POST json 并带 Content-Type', async () => {
  const fetchMock = stubFetch(async () => new Response(null, { status: 204 }));

  const t = new WebhookTransport({ url: 'https://example.com/hook' });
  await t.consume(sampleLog);

  expect(fetchMock).toHaveBeenCalledOnce();
  const [url, init] = fetchMock.mock.calls[0]!;
  expect(url).toBe('https://example.com/hook');
  expect(init?.method).toBe('POST');
  expect(init?.body).toBe(
    JSON.stringify({
      time: sampleLog.timestamp.toISOString(),
      level: 'error',
      message: 'hello',
    }),
  );
  expect(new Headers(init?.headers).get('Content-Type')).toBe('application/json');
});

test('URL 对象与自定义 method / headers', async () => {
  const fetchMock = stubFetch(async () => new Response(null, { status: 200 }));

  const t = new WebhookTransport({
    url: new URL('https://example.com/hook?x=1'),
    method: 'PUT',
    headers: {
      'Authorization': 'Bearer t',
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
  await t.consume(sampleLog);

  const [url, init] = fetchMock.mock.calls[0]!;
  expect(url).toBe('https://example.com/hook?x=1');
  expect(init?.method).toBe('PUT');
  const headers = new Headers(init?.headers);
  expect(headers.get('Authorization')).toBe('Bearer t');
  expect(headers.get('Content-Type')).toBe('application/json; charset=utf-8');
});

test('format=text', async () => {
  const fetchMock = stubFetch(async () => new Response(null, { status: 200 }));

  const t = new WebhookTransport({
    url: 'https://example.com/hook',
    format: 'text',
  });
  await t.consume(sampleLog);

  const [, init] = fetchMock.mock.calls[0]!;
  expect(init?.body).toBe('[error] 2024-10-30 22:03:03 hello');
  expect(new Headers(init?.headers).get('Content-Type')).toBe('text/plain;charset=utf-8');
});

test('自定义 format 函数', async () => {
  const fetchMock = stubFetch(async () => new Response(null, { status: 200 }));

  const t = new WebhookTransport({
    url: 'https://example.com/hook',
    format: (log) => JSON.stringify({ text: log.message }),
  });
  await t.consume(sampleLog);

  const [, init] = fetchMock.mock.calls[0]!;
  expect(init?.body).toBe(JSON.stringify({ text: 'hello' }));
  expect(new Headers(init?.headers).has('Content-Type')).toBe(false);
});

test('非 2xx 抛 i18n 错误', async () => {
  stubFetch(async () => new Response('nope', { status: 502, statusText: 'Bad Gateway' }));

  const t = new WebhookTransport({ url: 'https://example.com/hook' });
  await expect(t.consume(sampleLog)).rejects.toThrow(
    i18n.t('webhook_request_failed', {
      status: '502',
      statusText: 'Bad Gateway',
    }),
  );
});

test('超时抛 i18n 错误', async () => {
  stubFetch((_url, init) => {
    return new Promise<Response>((_resolve, reject) => {
      init?.signal?.addEventListener('abort', () => {
        const err = new Error('aborted');
        err.name = 'AbortError';
        reject(err);
      });
    });
  });

  const t = new WebhookTransport({
    url: 'https://example.com/hook',
    timeoutMs: 20,
  });
  await expect(t.consume(sampleLog)).rejects.toThrow(i18n.t('webhook_request_timed_out'));
});

test('json 含 exception', async () => {
  const fetchMock = stubFetch(async () => new Response(null, { status: 200 }));

  const exception = { type: 'Error', message: 'boom', stack: 'Error: boom' };
  const t = new WebhookTransport({ url: 'https://example.com/hook' });
  await t.consume({ ...sampleLog, exception });

  const [, init] = fetchMock.mock.calls[0]!;
  expect(init?.body).toBe(
    JSON.stringify({
      time: sampleLog.timestamp.toISOString(),
      level: 'error',
      message: 'hello',
      exception,
    }),
  );
});
