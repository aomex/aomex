import { WebApp } from '@aomex/web';
import request from 'supertest';
import { test } from 'vitest';
import { responseTime } from '../src';

test('hrtime: false', () => {
  const app = new WebApp();
  app.mount(responseTime({ hrtime: false }));

  return request(app.listen())
    .get('/')
    .expect('x-response-time', /^[0-9]{1,3}ms$/)
    .expect(404);
});

test('hrtime: true', () => {
  const app = new WebApp();
  app.mount(responseTime());

  return request(app.listen())
    .get('/')
    .expect('x-response-time', /^[0-9]{1,3}.[0-9]{3,6}ms$/)
    .expect(404);
});
