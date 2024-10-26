import { expect, test, vitest } from 'vitest';
import { helmet } from '../src';
import { WebApp, WebMiddleware } from '@aomex/web';
import { middleware } from '@aomex/common';
import supertest from 'supertest';

test('中间件', async () => {
  const md = helmet();
  expect(md).toBeInstanceOf(WebMiddleware);
});

test('默认设置报文', async () => {
  const app = new WebApp({ mount: [helmet()] });
  await supertest(app.listen())
    .get('/')
    .expect((res) => {
      expect(res.headers).toMatchObject({
        'content-security-policy':
          "default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests",
        'cross-origin-opener-policy': 'same-origin',
        'cross-origin-resource-policy': 'same-origin',
        'origin-agent-cluster': '?1',
        'referrer-policy': 'no-referrer',
        'strict-transport-security': 'max-age=31536000; includeSubDomains',
        'x-content-type-options': 'nosniff',
        'x-dns-prefetch-control': 'off',
        'x-download-options': 'noopen',
        'x-frame-options': 'SAMEORIGIN',
        'x-permitted-cross-domain-policies': 'none',
        'x-xss-protection': '0',
      });
    });
});

test('执行后面的中间件', async () => {
  const spy = vitest.fn();
  const app = new WebApp({
    mount: [helmet(), middleware.web(spy)],
  });
  await supertest(app.listen()).get('/');
  expect(spy).toBeCalledTimes(1);
});
