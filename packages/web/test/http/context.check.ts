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

// throw
[
  ctx.throw(400),
  ctx.throw(400, 'Bad Request'),
  ctx.throw(new Error('')),
  ctx.throw(400, new Error('')),
  ctx.throw(401, '', {
    expose: true,
    headers: {},
  }),

  ctx.throw(404, {
    headers: {} as Record<string, number>,
  }),
  ctx.throw(404, {
    headers: {} as Record<string, string>,
  }),
  ctx.throw(404, {
    headers: {} as Record<string, string[]>,
  }),
];
