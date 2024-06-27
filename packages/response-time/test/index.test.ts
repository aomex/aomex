import { WebApp } from '@aomex/web';
import request from 'supertest';
import { test } from 'vitest';
import { responseTime } from '../src';
import { mdchain, middleware } from '@aomex/core';

test('增加报头 x-response-time', () => {
  const app = new WebApp({ mount: mdchain.web.mount(responseTime) });

  return request(app.listen())
    .get('/')
    .expect('x-response-time', /^[0-9]{1,3}\.[0-9]{2,6}ms$/)
    .expect(404);
});

test('报错不影响', () => {
  const app = new WebApp({
    mount: mdchain.web.mount(responseTime).mount(
      middleware.web((ctx) => {
        ctx.throw(400);
      }),
    ),
  });

  return request(app.listen())
    .get('/')
    .expect('x-response-time', /^[0-9]{1,3}\.[0-9]{2,6}ms$/)
    .expect(400);
});
