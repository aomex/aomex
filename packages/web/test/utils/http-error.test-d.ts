import { expectType } from 'ts-expect';
import { HttpError, type HttpErrorProperties, type HttpErrorStatus } from '../../src';

// HttpError 构造：仅 4xx/5xx
{
  const a = new HttpError(404);
  expectType<HttpError>(a);
  expectType<HttpErrorStatus>(a.statusCode);
  expectType<boolean>(a.expose);
  expectType<string | undefined>(a.code);
  expectType<Record<string, string | number> | undefined>(a.headers);

  new HttpError(500, 'msg');
  new HttpError(400, 'msg', { expose: false, code: 'X', headers: { a: '1' } });
  // 合并状态表后保留的合法码
  new HttpError(411);
  // @ts-expect-error 已剔除的非法码
  new HttpError(427);

  // @ts-expect-error 缺 statusCode
  new HttpError();
  // @ts-expect-error 非错误状态码
  new HttpError(200);
  // @ts-expect-error 非错误状态码
  new HttpError(302);
  // @ts-expect-error 非法状态码
  new HttpError(999);

  const err = new HttpError(404);
  // @ts-expect-error 不再暴露 status
  err.status;
}

// HttpErrorProperties：无任意索引 / 无 status*
{
  const ok: HttpErrorProperties = {
    expose: true,
    code: 'X',
    headers: { a: '1' },
    cause: new Error(),
  };
  void ok;

  // @ts-expect-error 禁止 status
  const bad1: HttpErrorProperties = { status: 404 };
  void bad1;
  // @ts-expect-error 禁止 statusCode
  const bad2: HttpErrorProperties = { statusCode: 404 };
  void bad2;
  // @ts-expect-error 禁止任意键
  const bad3: HttpErrorProperties = { foo: 1 };
  void bad3;
  const headersOk: HttpErrorProperties = { headers: { a: '1', b: 2 } };
  void headersOk;
  // @ts-expect-error headers 值不可为数组
  const bad4: HttpErrorProperties = { headers: { a: ['1'] } };
  void bad4;
}

// HttpError.from
{
  expectType<HttpError>(HttpError.from(new Error('x')));
  expectType<HttpError>(HttpError.from(new HttpError(404)));
  expectType<HttpError>(HttpError.from('msg'));
  expectType<HttpError>(HttpError.from({ code: 'ENOENT' }));
  expectType<HttpError>(HttpError.from(null));
}

// HttpError.isError 收窄为本类
{
  const v: unknown = null;
  if (HttpError.isError(v)) {
    expectType<HttpError>(v);
    expectType<HttpErrorStatus>(v.statusCode);
  }
  if (Error.isError(v)) {
    expectType<Error>(v);
    // @ts-expect-error 上游 isError 不收窄到 HttpError
    v.statusCode;
  }
}
