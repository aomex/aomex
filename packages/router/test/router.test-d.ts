import { mdchain, middleware } from '@aomex/core';
import { Router } from '../src';
import { type TypeEqual, expectType } from 'ts-expect';
import { WebContext, response } from '@aomex/web';

// 创建实例
{
  new Router();
  new Router({});
  new Router({ prefix: '/' });
  new Router({ mount: mdchain.web });
  // @ts-expect-error
  new Router({ mount: mdchain.mixin });
  // @ts-expect-error
  new Router({ mount: mdchain.console });
  // @ts-expect-error
  new Router({ mount: middleware.web(() => {}) });
}

// 创建路由
{
  const router = new Router();
  router.get('/', {
    action: (ctx) => {
      expectType<WebContext>(ctx);
    },
  });
  // @ts-expect-error
  router.get('/', {});
}

// 中间件
{
  const router = new Router({
    mount: mdchain.web.mount(middleware.web<{ x: { y: 'z' } }>(() => {})),
  });

  router.get('/', {
    mount: [
      middleware.web<{ a: boolean }>(() => {}),
      middleware.web<{ b: string | undefined }>(() => {}),
    ],
    action: (ctx) => {
      const x = ctx.x;
      expectType<TypeEqual<{ y: 'z' }, typeof x>>(true);
      expectType<boolean>(ctx.a);
      expectType<string | undefined>(ctx.b);
    },
  });

  router.get('', {
    mount: [
      middleware.web(() => {}),
      middleware.mixin(() => {}),
      mdchain.web,
      mdchain.mixin,
    ],
    action: () => {},
  });

  router.get('', {
    // @ts-expect-error
    mount: [middleware.console(() => {})],
    action: () => {},
  });

  router.get('', {
    // @ts-expect-error
    mount: [mdchain.console(() => {})],
    action: () => {},
  });
}

// Data Transfer Object (DTO)
{
  const router = new Router({
    mount: mdchain.web.mount(middleware.web<{ x: { y: 'z' } }>(() => {})),
  });

  class Test {
    declare test1: number;
  }

  const dto = router.get('/', {
    mount: [
      response({ statusCode: 200 }),
      middleware.web<{ a: Test }>(() => {}),
      middleware.web<{ b: string | undefined }>(() => {}),
    ],
    action: () => {},
  });

  (function (_: typeof dto.a) {});

  dto.a;
  dto['a'];
  dto['b'];
  // @ts-expect-error
  dto['send'];
  // @ts-expect-error
  dto['throw'];
  // @ts-expect-error
  dto['redirect'];

  expectType<TypeEqual<Test, (typeof dto)['a']>>(true);
  expectType<string | undefined>(dto.b);
}

// 响应方法定制
{
  const router = new Router();

  router.get('/', {
    action: (ctx) => {
      ctx.send(200, 'foo');
      ctx.send(201, 'foo');
      ctx.send(123, { foo: 'bar' });

      ctx.redirect('http://');
      ctx.redirect(305, 'http');

      ctx.throw(500);
      ctx.throw(503, 'error');
    },
  });

  router.get('/', {
    mount: [
      middleware.web<{ a: string }>(() => {}),
      response({
        statusCode: 200,
      }),
    ],
    action: (ctx) => {
      ctx.send('foo');
      ctx.send(200, 'foo');
      ctx.send({ foo: 'bar' });
      // @ts-expect-error
      ctx.send();
      // @ts-expect-error
      ctx.send(201, 'foo');

      // @ts-expect-error
      ctx.redirect;
      // @ts-expect-error
      ctx.throw;
    },
  });

  router.get('/', {
    mount: [
      response({
        statusCode: 302,
      }),
    ],
    action: (ctx) => {
      ctx.redirect(302, 'foo bar');
      ctx.redirect(302, 'foo bar');
      // @ts-expect-error
      ctx.send;
      // @ts-expect-error
      ctx.throw;
    },
  });

  router.get('/', {
    mount: [
      response({
        statusCode: 200,
      }),
      response({
        statusCode: 201,
      }),
      response({
        statusCode: 401,
      }),
      response({
        statusCode: 302,
      }),
    ],
    action: (ctx) => {
      ctx.send(200, 'foo bar');
      ctx.send(201, 'foo bar');
      // @ts-expect-error
      ctx.send(202, 'foo bar');

      ctx.redirect(302, 'http');
      // @ts-expect-error
      ctx.redirect(301, 'http');

      ctx.throw(401);
      // @ts-expect-error
      ctx.throw(402);
    },
  });
}
