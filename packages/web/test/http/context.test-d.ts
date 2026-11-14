import type { WebContext } from '../../src';

let ctx!: WebContext;

// send
{
  ctx.send(200, {});
  ctx.send(201, 'ok');
  ctx.send('foo');
  ctx.send(200);
  ctx.send([]);
  ctx.send(Buffer.from([]));

  // @ts-expect-error
  ctx.send();
  // @ts-expect-error
  ctx.send(200, 200);
  // @ts-expect-error
  ctx.send('foo', 200);
}

// throw：必须带 statusCode；函数属性隔离 never
{
  const ok = {
    a: () => ctx.throw(400),
    b: () => ctx.throw(400, 'Bad Request'),
    c: () => ctx.throw(400, new Error('')),
    d: () =>
      ctx.throw(401, '', {
        expose: true,
        headers: {},
      }),
    e: () =>
      ctx.throw(404, {
        headers: {} as Record<string, string>,
      }),
    f: () =>
      ctx.throw(404, {
        headers: {} as Record<string, number>,
      }),
    g: () =>
      ctx.throw(404, {
        headers: { a: '1', b: 2 },
      }),
    h: () => ctx.throw(500, new Error('x'), { expose: true }),
  };
  void ok;
}

{
  const bad = {
    // @ts-expect-error 非错误状态码
    a: () => ctx.throw(200),
    // @ts-expect-error 非错误状态码
    b: () => ctx.throw(302),
    // @ts-expect-error 禁止无状态码只传 Error
    c: () => ctx.throw(new Error('')),
    d: () => {
      ctx.throw(404, {
        // @ts-expect-error headers 不可为 string[]
        headers: {} as Record<string, string[]>,
      });
    },
  };
  void bad;
}
