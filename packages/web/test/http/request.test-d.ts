import { type TypeEqual, expectType } from 'ts-expect';
import type { BaseWebRequest, WebRequest } from '../../src';
import type { Accepts } from 'accepts';

let request!: WebRequest;
let base!: BaseWebRequest;

expectType<TypeEqual<true, WebRequest extends BaseWebRequest ? true : false>>(true);

expectType<string>(request.method);
expectType<string>(request.url);

expectType<Accepts>(request.accept);
expectType<
  TypeEqual<{ readonly [key: string]: string | undefined }, typeof request.cookies>
>(true);
expectType<TypeEqual<unknown, typeof request.body>>(true);
expectType<boolean>(request.fresh);
expectType<string>(request.host);
expectType<string>(request.href);
expectType<string>(request.ip);
expectType<string>(request.origin);
expectType<string>(request.pathname);
expectType<string>(request.protocol);
expectType<TypeEqual<Record<string, unknown>, typeof request.query>>(true);
expectType<string>(request.querystring);
expectType<string>(request.search);
expectType<boolean>(request.secure);
expectType<string | null>(request.matchContentType(''));
expectType<string | null>(request.matchContentType('json', 'urlencoded'));

expectType<Accepts>(base.accept);
expectType<string>(base.contentType);
expectType<
  TypeEqual<{ readonly [key: string]: string | undefined }, typeof base.cookies>
>(true);
expectType<string>(base.host);
expectType<string>(base.href);
expectType<string>(base.ip);
expectType<string>(base.origin);
expectType<string>(base.pathname);
expectType<string>(base.protocol);
expectType<TypeEqual<Record<string, unknown>, typeof base.query>>(true);
expectType<string>(base.querystring);
expectType<string>(base.search);
expectType<boolean>(base.secure);
expectType<string | null>(base.matchContentType(''));
expectType<string | null>(base.matchContentType('json', 'urlencoded'));
// Base 不含依赖 res / body 管线的面
expectType<TypeEqual<false, 'body' extends keyof BaseWebRequest ? true : false>>(true);
expectType<TypeEqual<false, 'fresh' extends keyof BaseWebRequest ? true : false>>(true);
expectType<TypeEqual<false, 'rawBody' extends keyof BaseWebRequest ? true : false>>(true);

// LowerExternal 增强后的请求头推断
expectType<string | undefined>(request.headers['x-forwarded-for']);
expectType<string | undefined>(request.headers['cf-connecting-ip']);
expectType<string | undefined>(request.headers['fastly-client-ip']);
expectType<string | undefined>(request.headers['true-client-ip']);
expectType<string | undefined>(request.headers['x-cluster-client-ip']);
expectType<string | undefined>(request.headers['x-appengine-user-ip']);
expectType<string | undefined>(request.headers['last-event-id']);
expectType<string | undefined>(request.headers[':authority']);
expectType<string | undefined>(request.headers['access-control-request-private-network']);
expectType<string | undefined>(request.headers['dnt']);
expectType<string | undefined>(request.headers['te']);
expectType<string | undefined>(request.headers['early-data']);
expectType<string | undefined>(request.headers['sec-ch-ua']);
expectType<string | undefined>(request.headers['upgrade-insecure-requests']);
