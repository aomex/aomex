import { expectType } from 'ts-expect';
import type { TypeEqual } from 'ts-expect';
import { WebhookTransport } from '../../src';
import type { LogRecord } from '../../src/types';

{
  new WebhookTransport({ url: 'https://example.com/hook' });
  new WebhookTransport({ url: new URL('https://example.com/hook') });
  new WebhookTransport({
    url: 'https://example.com/hook',
    method: 'PUT',
    headers: { Authorization: 'Bearer x' },
    format: 'text',
    timeoutMs: 1_000,
  });
  new WebhookTransport({
    url: 'https://example.com/hook',
    format: (log: LogRecord) => log.message,
  });
  new WebhookTransport({
    url: 'https://example.com/hook',
    format: async (log) => new Blob([log.message]),
  });
}

{
  // @ts-expect-error url 必填
  new WebhookTransport({});
  // @ts-expect-error url 类型非法
  new WebhookTransport({ url: 1 });
  // @ts-expect-error format 非法
  new WebhookTransport({ url: 'https://example.com', format: 'xml' });
  new WebhookTransport({
    url: 'https://example.com',
    // @ts-expect-error format 回调返回值须为请求体类型
    format: () => true,
  });
}

{
  expectType<
    TypeEqual<typeof WebhookTransport, typeof import('../../src').WebhookTransport>
  >(true);
}
