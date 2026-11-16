import { type TypeEqual, expectType } from 'ts-expect';
import { WebResponse, type Body } from '../../src';
import { ServerResponse } from 'http';

let res!: WebResponse;

expectType<TypeEqual<Body, typeof res.body>>(true);
expectType<number>(res.contentLength);
expectType<string>(res.contentType);
expectType<Promise<void>>(res.download(''));
expectType<Promise<void>>(res.download('/tmp/a.txt', 'attachment'));
expectType<Promise<void>>(res.download('/tmp/a.txt', 'inline'));
// @ts-expect-error download type 仅允许 attachment | inline
res.download('/tmp/a.txt', 'form-data');
expectType<boolean>(res.isJSON(''));
expectType<string | null>(res.matchContentType(''));
expectType<string | null>(res.matchContentType('application/*', 'text/*'));
expectType<TypeEqual<ServerResponse, typeof res.res>>(true);

expectType<void>(res.setCookie('a', 'b'));
expectType<void>(
  res.setCookie('a', 'b', {
    path: '/',
    domain: 'example.com',
    sameSite: 'lax',
    httpOnly: true,
    secure: true,
    maxAge: 1,
    expires: new Date(),
    encode: (v) => v,
  }),
);
expectType<void>(res.setCookie('a', 'b', { sameSite: 'none' }));
expectType<void>(res.setCookie('a', 'b', { sameSite: 'strict' }));
expectType<void>(res.setCookie('a', 'b', { sameSite: true }));
expectType<void>(res.setCookie('a', 'b', { sameSite: false }));
// @ts-expect-error 非法 sameSite
res.setCookie('a', 'b', { sameSite: 'invalid' });
expectType<void>(res.removeCookie('a'));
expectType<void>(res.removeCookie('a', { path: '/' }));
// @ts-expect-error removeCookie 仅接受 path
res.removeCookie('a', { domain: 'example.com' });
