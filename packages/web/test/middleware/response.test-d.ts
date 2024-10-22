import { type TypeEqual, expectType } from 'ts-expect';
import { WebResponseMiddleware, response, type Body } from '../../src';
import { Middleware, NumberValidator, StringValidator, rule } from '@aomex/core';
import type { Union2Intersection } from '@aomex/internal-tools';
import { createReadStream } from 'node:fs';

// 响应内容
{
  const mdw = response({
    statusCode: 200,
    content: { test: rule.string(), test1: rule.number() },
  });

  expectType<
    TypeEqual<
      WebResponseMiddleware<200, { test: StringValidator; test1: NumberValidator }>,
      typeof mdw
    >
  >(true);
}

// 报文
{
  response({
    statusCode: 200,
    headers: { test: rule.string(), test1: rule.string() },
  });
}

// 枚举状态码
{
  response({ statusCode: 200 });
  response({ statusCode: 400 });
  // @ts-expect-error
  response({});
  // @ts-expect-error
  response({ statusCode: 678 });
  // @ts-expect-error
  response({ statusCode: '404' });
  // @ts-expect-error
  response({ statusCode: 'Not Found' });
}

// 根据schema限定body参数
{
  const s200 = response({
    statusCode: 200,
    content: {
      foo: rule.int(),
      bar: rule.string().optional().nullable(),
    },
  });

  let ctx!: Union2Intersection<Middleware.Infer<typeof s200>>;
  ctx.send(200, { foo: 1, bar: 'bar' });
  ctx.send(200, { foo: 1, bar: undefined });
  ctx.send(200, { foo: 1, bar: null });
  ctx.send(200, { foo: 1 });
  // @ts-expect-error
  ctx.send(200, {});
  // @ts-expect-error
  ctx.send(200, { bar: 'bar' });

  // @ts-expect-error
  ctx.send(200, 'foo');
  // @ts-expect-error
  ctx.send(200, Buffer.from('foo'));
  // @ts-expect-error
  ctx.send(200, createReadStream('path/to/file'));
  // @ts-expect-error
  ctx.send(200, null);
}

// 200状态码可以省略
{
  const s200 = response({ statusCode: 200 });
  const s201 = response({ statusCode: 201 });
  let ctx1!: Union2Intersection<Middleware.Infer<typeof s200>>;
  ctx1.send('ok');
  ctx1.send(200, '');

  let ctx2!: Union2Intersection<Middleware.Infer<typeof s201>>;
  // @ts-expect-error
  ctx2.send('ok');
  ctx2.send(201, '');
}

// 成功状态码
{
  const s200 = response({ statusCode: 200 });
  let ctx!: Union2Intersection<Middleware.Infer<typeof s200>>;

  ctx.send;
  // @ts-expect-error
  ctx.throw;
  // @ts-expect-error
  ctx.redirect;
}

// 跳转状态码
{
  const s302 = response({ statusCode: 301 });
  let ctx!: Union2Intersection<Middleware.Infer<typeof s302>>;

  // @ts-expect-error
  ctx.send;
  // @ts-expect-error
  ctx.throw;
  ctx.redirect;
}

// 错误状态码
{
  const s401 = response({ statusCode: 401 });
  const s500 = response({ statusCode: 500 });
  let ctx!: Union2Intersection<
    Middleware.Infer<typeof s401> | Middleware.Infer<typeof s500>
  >;

  // @ts-expect-error
  ctx.send;
  ctx.throw;
  // @ts-expect-error
  ctx.redirect;
}

// body 联合类型
{
  const s200 = response({
    statusCode: 200,
    content: rule.oneOf([rule.object({ foo: rule.string() }), rule.string()]),
  });
  let ctx!: Union2Intersection<Middleware.Infer<typeof s200>>;

  ctx.send(200, { foo: 'bar' });
  ctx.send(200, 'abc');
  // @ts-expect-error
  ctx.send(200, true);
}

// 相同状态码重叠
{
  const s200_1 = response({
    statusCode: 200,
    content: rule.oneOf([rule.object({ foo: rule.string() }), rule.string()]),
  });
  const s200_2 = response({
    statusCode: 200,
    content: rule.array(rule.boolean()),
  });
  let ctx!: Union2Intersection<
    Middleware.Infer<typeof s200_1> | Middleware.Infer<typeof s200_2>
  >;

  ctx.send(200, { foo: 'bar' });
  ctx.send(200, 'abc');
  ctx.send(200, []);
  ctx.send(200, [false, true]);
  ctx.send([]);
  ctx.send({ foo: 'bar' });
  // @ts-expect-error
  ctx.send(200, ['ok']);
  // @ts-expect-error
  ctx.send(200, true);
}

// 未制定响应内容时，body可以随意传
{
  const s201 = response({ statusCode: 201 });
  let ctx!: Union2Intersection<Middleware.Infer<typeof s201>>;

  expectType<TypeEqual<(statusCode: 201, body: Body) => void, (typeof ctx)['send']>>(
    true,
  );
}

// 空状态码，body可以不传，也可以是null
{
  const s204 = response({ statusCode: 204 });
  let ctx!: Union2Intersection<Middleware.Infer<typeof s204>>;

  ctx.send(204);
  ctx.send(204, null);
  // @ts-expect-error
  ctx.send(204, 'ok');
  // @ts-expect-error
  ctx.send(204, undefined);
}

// 自动过滤Body类型之外的数据类型
{
  const s200 = response({
    statusCode: 200,
    content: rule.oneOf([rule.number(), rule.boolean(), rule.string()]),
  });
  let ctx!: Union2Intersection<Middleware.Infer<typeof s200>>;

  ctx.send(200, 'abc');
  // @ts-expect-error
  ctx.send(200, 123);
  // @ts-expect-error
  ctx.send(200, true);
  // @ts-expect-error
  ctx.send(200, false);
}
