import { TestWebApp } from '../../web/src/testing';
import request from 'supertest';
import { test } from 'vitest';
import { responseTime } from '../src';
import { middleware } from '@aomex/common';
test('增加报头 x-response-time', () => {
  const app = new TestWebApp({ mount: [responseTime()] });

  return request(app.listen())
    .get('/')
    .expect('x-response-time', /^[0-9]{1,3}\.[0-9]{2,6}ms$/)
    .expect(404);
});

test('报错不影响', () => {
  const app = new TestWebApp({
    mount: [
      responseTime(),
      middleware.web((ctx) => {
        ctx.throw(400);
      }),
    ],
  });

  return request(app.listen())
    .get('/')
    .expect('x-response-time', /^[0-9]{1,3}\.[0-9]{2,6}ms$/)
    .expect(400);
});
